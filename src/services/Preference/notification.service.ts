import { IPaginationFilter, NotifyDto, PaginatedDocument } from "../../interfaces";
import { FCMToken, Notification, NotificationStatus, customer, fcmToken, notification } from "../../models";
import { RoleService } from "../role.service";
import { createError, getUpdateOptions, paginate, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";


import sdk from 'firebase-admin'
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import config from "../../config";


const {privateKey} = !!config.FIREBASE_PRIVATE_KEY ? JSON.parse(config.FIREBASE_PRIVATE_KEY) : {privateKey: undefined};


// console.log(`\n\n\n-------------------- FIREBASE PRIVATE KEY --------------------------\n\n${privateKey}\n\n--------------------------------------------------------------------\n\n\n`)

// const service_account = require('../../../nourisha-c326f-firebase-adminsdk-tze7h-860614c18b.json');
const admin = sdk.initializeApp({
  // credential: sdk.credential.cert(service_account),
  credential: sdk.credential.cert({
    clientEmail: config.FIREBASE_CLIENT_EMAIL,
    privateKey,
    projectId: config.FIREBASE_PROJECT_ID,
  })
})





export class NotificationService {
  async getCurrentUserNotifications(
    customer_id: string,
    roles: string[],
    filters: IPaginationFilter & { status?: NotificationStatus }
  ): Promise<PaginatedDocument<Notification[]>> {
    await RoleService.hasPermission(roles, AvailableResource.NOTIFICATION, [PermissionScope.READ, PermissionScope.ALL]);
    let queries: any = { customer: customer_id, is_broadcast: false, is_admin: false };
    if (!!filters?.status) Object.assign(queries, { status: filters.status });
    return await paginate("notification", queries, filters);
  }

  async getSentBroadcasts(
    roles: string[],
    filters: IPaginationFilter & { status?: NotificationStatus }
  ): Promise<PaginatedDocument<Notification[]>> {
    await RoleService.hasPermission(roles, AvailableResource.BROADCAST, [PermissionScope.READ, PermissionScope.ALL]);
    let queries: any = { is_broadcast: true };
    if (!!filters?.status) Object.assign(queries, { status: filters.status });
    return await paginate("notification", queries, filters);
  }

  async markAsRead(id: string, customer_id: string, roles: string[]) {
    await RoleService.hasPermission(roles, AvailableResource.NOTIFICATION, [PermissionScope.MARK, PermissionScope.ALL]);
    const note = await notification.findOneAndUpdate({ _id: id, customer: customer_id }, { status: "read", delivered: true }).lean<Notification>().exec();
    if (!note) throw createError("Notification does not exist", 404);
    return note;
  }

  async updateFCMToken(customer_id: string, dto: {token: string; deviceId: string}, roles: string[]) {
    validateFields(dto, ['token', 'deviceId']);
    await RoleService.hasPermission(roles, AvailableResource.NOTIFICATION, [PermissionScope.READ, PermissionScope.ALL]);
    const device_token = await fcmToken.findOneAndUpdate({customer: customer_id}, {...dto}, getUpdateOptions()).lean<FCMToken>().exec();
    return device_token;
  }

  static async notify(customer_id: string, dto: Omit<NotifyDto, 'tokens'>) {
    validateFields(dto, ['tag', 'content', 'title', 'ticker']);
    const tokens = await NotificationService.getCustomerDeviceTokens(customer_id) ?? undefined;
    return await this.send({...dto, tokens});
  }

  static async broadcast(dto: Omit<NotifyDto, 'tokens'>, roles: string[]) {
    validateFields(dto, ['tag', 'content', 'title']);
    await RoleService.hasPermission(roles, AvailableResource.BROADCAST, [PermissionScope.BROADCAST, PermissionScope.ALL]);
    const tokens = (await NotificationService.getAllDeviceTokens({customer_ids: dto?.customer_ids, roles: dto?.roles})) ?? undefined;
    return await this.send({...dto, ticker: dto?.tag, tokens}, true);
  }

  private static async send(dto: NotifyDto, is_broadcast = false) {
    const tokens = dto?.tokens;
    if(!tokens) return null;

    const message = await this.pushNotificationConfig(dto);

    const [response, note] = await Promise.all([
      admin.messaging().sendEachForMulticast({ tokens, ...message}), 
      notification.create({...dto, is_broadcast})
    ]);

    if(!!response && response.failureCount > 0) {
      const possible_error_codes = ['messaging/registration-token-not-registered', 'messaging/mismatched-credential', 'messaging/invalid-registration-token']
      let failed_tokens: string[] = [];
      response.responses.forEach((res, idx) => {
        if(!!res.error && possible_error_codes.includes(res.error.code)) {
          failed_tokens.push(tokens[idx]);
        }
      })

      if(failed_tokens.length > 0) await this.removeFailedDeviceTokens(failed_tokens);
    }

    return {note, ...response};
  }


  static async getCustomerDeviceTokens(customer_id: string): Promise<string[] | null> {
    const fcm = await fcmToken.find({customer: customer_id}).lean<FCMToken[]>().exec();
    if(!fcm || fcm?.length < 1) return null;
    return fcm.map(each => each.token);
  }

  static async getAllDeviceTokens(options?: Partial<{customer_ids: string[], roles: string[]}>): Promise<string[] | null> {
    const where: any = {};
    const {customer_ids, roles} = options ?? {};

    if(!!roles && roles.length > 0) {
      const role_ids = (await RoleService.getRoleBySlugs(roles)).map(role => role?._id).filter(Boolean) as string[];
      const ids = (await customer.find({roles: {$in: role_ids}}).select('_id').exec()).map(cus => cus?._id).filter(Boolean) as string[];
      Object.assign(where, {customer: {$in: ids}});
    }
    else if(!!customer_ids && customer_ids.length > 0) Object.assign(where, {customer: {$in: customer_ids}});

    const fcm = await fcmToken.find(where).lean<FCMToken[]>().exec();
    if(!fcm || fcm?.length < 1) return null;
    return fcm.map(each => each.token);
  }

  static async removeFailedDeviceTokens(failed_tokens: string[]) {
    // console.log("Tokens to remove", failed_tokens)
    const result = await fcmToken.deleteMany({token: {$in: failed_tokens}}).lean().exec().catch(err => console.log("Error removing failed fcm tokens", err));
    return result;
  }

  static async pushNotificationConfig(dto: NotifyDto): Promise<Omit<MulticastMessage, 'tokens'>> {
    return  {
      apns: {
        payload: {
          aps: {
            sound: 'default',
            mutableContent: true,
            contentAvailable: true,
          },
        },
        headers: {
          'apns-priority': '5',
          'apns-push-type': 'alert',
        }
      },
      android: {
        priority: "high",
        data: {
          event: dto.tag,
          body: JSON.stringify(dto),
        },
        notification: {
          color: '#FE7E00',
          icon: 'https://res.cloudinary.com/drivfk4v3/image/upload/c_scale,w_79/v1688665730/Nourisha/logo-icon_frbirl.png',
          channelId: dto.tag,
          defaultSound: true,
          defaultVibrateTimings: true,
          notificationCount: 0,
          visibility: 'public',
          ticker: dto.ticker,
          title: dto.title,
          body: dto.content,
          priority: 'max',
        }
      },
      data: {
        event: dto.tag,
        body: JSON.stringify(dto),
      },
      notification: {
        title: dto.title,
        body: dto.content,
        // imageUrl: 'https://res.cloudinary.com/drivfk4v3/image/upload/c_scale,w_79/v1688665730/Nourisha/logo-icon_frbirl.png'
      },

       webpush: {
          headers: {
            Urgency: 'high',
          },
          // fcmOptions: {
          //   link: 'https://medical.aeglehealth.io',

          // },
          notification: {
            icon: 'https://res.cloudinary.com/drivfk4v3/image/upload/c_scale,w_79/v1688665730/Nourisha/logo-icon_frbirl.png',
            requireInteraction: true,
            vibrate: 23,
            // timestamp: Date.now(),
            tag: dto.tag,
            title: dto.title,
            body: dto.content,
          },
          data: {
            event: dto.tag,
            body: JSON.stringify(dto),
          },
        },
      
    }
  }
}
