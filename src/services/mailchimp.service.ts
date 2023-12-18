import crypto from "crypto";
import { chunk, join } from "lodash";
import marketing from "@mailchimp/mailchimp_marketing";
import { CustomerDto } from "../interfaces";
import customer, { Address, Customer } from "../models/customer";
import { createError, validateFields } from "../utils";
import { when } from "../utils/when";
import { RoleService } from "./role.service";
import { AvailableResource, AvailableRole, PermissionScope } from "../valueObjects";
import config from "../config";
import { Plan, Subscription } from "models";

// let AUDIENCE_ID = when(isTesting, "ff0ac6ef9b", "edb6cbfd3d");

let AUDIENCE_ID = "ff0ac6ef9b";

// if (isTesting) {
// Test Config
marketing.setConfig({
  apiKey: config.MAILCHIMP_API_KEY,
  server: config.MAILCHIMP_SERVER,
});

// Prod Config
//   marketing.setConfig({
//     apiKey: "b90601c0a376a9125c61df11f28973af-us8",
//     server: "us8",
//   });

const TAGS = ["customer", "nourisha-api"];

interface UpdateContactSubscriptionDto {
  plan_name: string;
  sub_status: string;
  addr?: Address;
}

export class MailchimpService {
  static async AddContact(dto: CustomerDto) {
    try {
      const result = await marketing.lists.addListMember(
        AUDIENCE_ID,
        {
          email_address: dto?.email,
          status: "subscribed",
          tags: TAGS,
          merge_fields: {
            FNAME: dto?.first_name,
            LNAME: dto?.last_name,
            PHONE: dto?.phone,
            GENDER: dto?.gender ?? "unspecified",
            REFERRAL: dto?.ref_code,
            // ADDRESS: {
            //   addr1: "",
            //   city: "",
            //   state: "",
            //   zip: "",
            // },
          },
        },
        { skipMergeValidation: true }
      );
      return result;
    } catch (error) {
      console.log("[AddContact Error]", error);
    }

    return null;
  }

  static async updateContactAddr(email: string, dto: Address) {
    validateFields(dto, ["address_", "city", "postcode"]);
    const email_hash = crypto.createHash("md5").update(email).digest("hex").toLowerCase();

    try {
      // console.log(dto);
      const result = await marketing.lists.updateListMember(
        AUDIENCE_ID,
        email_hash,
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            ADDRESS: {
              addr1: dto?.address_,
              city: dto?.city,
              // state: dto?.,
              zip: dto?.postcode,
              country: undefined,
            },
            POSTCODE: dto?.postcode,
            COUNTRY: dto?.country,
          },
        },
        { skipMergeValidation: false }
      );
      // console.log("[updateContactAddr]", result);
      return result;
    } catch (error) {
      console.log("[updateContactAddr Error]", error);
    }

    return null;
  }

  static async updateContactSubscription(email: string, dto: UpdateContactSubscriptionDto) {
    const email_hash = crypto.createHash("md5").update(email).digest("hex").toLowerCase();

    console.log("[updateContactSubscription]", { email, ...dto });

    try {
      // console.log(dto);
      const result = await marketing.lists.updateListMember(
        AUDIENCE_ID,
        email_hash,
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            PLAN: dto?.plan_name,
            SUB_STATUS: dto?.sub_status,
            ADDRESS: {
              addr1: dto?.addr?.address_,
              city: dto?.addr?.city,
              // state: dto?.,
              zip: dto?.addr?.postcode,
              country: undefined,
            },
          },
        },
        { skipMergeValidation: false }
      );
      // console.log("[updateContactAddr]", result);
      return result;
    } catch (error) {
      console.log("[updateContactAddr Error]", error);
    }

    return null;
  }

  static async syncCustomersToMailchimp(roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.BROADCAST,
      PermissionScope.ALL,
    ]);

    let customers = await customer
      .find()
      .populate([{ path: "subscription", populate: ["plan"] }])
      .lean<Customer[]>()
      .exec();
    customers = customers.filter((cus) => {
      const name = join([cus?.first_name, cus?.first_name], " ");
      return !(name ?? "").includes("test");
    });

    console.log("Customer Chunks", customers);

    const chunks = chunk(customers, 300);
    let to_run: any = chunks.map((chunk) => this.batchContactsSyncToMailchimp(chunk));
    const results = await Promise.all(to_run);
    return results;
  }

  static async batchContactsSyncToMailchimp(customers: Customer[]) {
    try {
      const result = await marketing.lists.batchListMembers(
        AUDIENCE_ID,
        {
          members: customers.map((cus) => {
            const sub = cus?.subscription as Subscription;
            const pln = sub?.plan as Plan;

            return {
              email_address: cus?.email,
              email_type: "html",
              status: "subscribed",
              tags: TAGS,
              merge_fields: {
                FNAME: cus?.first_name,
                LNAME: cus?.last_name,
                PHONE: cus?.phone,
                GENDER: cus?.gender ?? "unspecified",
                REFERRAL: cus?.ref_code,
                PLAN: when(!!pln?.name && sub?.status === "active", pln?.name, "NO_PLAN"),
                SUB_STATUS: sub?.status,
                ADDRESS: when(!!cus?.address, this.constructAddr(cus?.address), ""),
                //   ADDRESS: {
                //     addr1: cus?.address?.address_,
                //     city: cus?.address?.city,
                //     // state: cus?.address?.,
                //     zip: cus?.address?.postcode,
                //   } as any,
                POSTCODE: cus?.address?.postcode,
                COUNTRY: cus?.address?.country,
              },
            };
          }),
        },
        { skipMergeValidation: true }
      );
      return result;
    } catch (error) {
      console.log("[Batch Error]", error);
      throw createError(error.message);
    }
  }

  static constructAddr(addr: Address) {
    return join([addr?.address_, addr?.city, when(!!addr?.postcode, `, ${addr?.postcode}`, ""), addr?.country].filter(Boolean), " ");
  }
}
