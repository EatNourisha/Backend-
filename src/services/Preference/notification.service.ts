import { IPaginationFilter, NotifyDto, PaginatedDocument } from "../../interfaces";
import { FCMToken, Notification, NotificationStatus, fcmToken, notification } from "../../models";
import { RoleService } from "../role.service";
import { createError, getUpdateOptions, paginate, validateFields } from "../../utils";
import { AvailableResource, PermissionScope } from "../../valueObjects";


import sdk from 'firebase-admin'
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import config from "../../config";

// console.log(config.FIREBASE_PRIVATE_KEY)

const {privateKey} = !!config.FIREBASE_PRIVATE_KEY ? JSON.parse(config.FIREBASE_PRIVATE_KEY) : {privateKey: undefined};

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
    let queries: any = { customer: customer_id };
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

  static async notify(customer_id: string, dto: NotifyDto) {
    validateFields(dto, ['tag', 'content', 'title', 'ticker']);
    const tokens = dto?.tokens ?? await NotificationService.getCustomerDeviceTokens(customer_id);

    // console.log("Notification Tokens", tokens);
    if(!tokens) return null;

    const message = await this.pushNotificationConfig(dto);

    const [response, note] = await Promise.all([
      admin.messaging().sendEachForMulticast({ tokens, ...message}), 
      notification.create({customer: customer_id, ...dto})
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
