import crypto from "crypto";
import { chunk, join } from "lodash";
import marketing from "@mailchimp/mailchimp_marketing";
import { CustomerDto } from "../interfaces";
import customer, { Address, Customer } from "../models/customer";
import { validateFields } from "../utils";
import { when } from "../utils/when";
import { RoleService } from "./role.service";
import { AvailableResource, AvailableRole, PermissionScope } from "../valueObjects";
import { isTesting } from "../config";

let AUDIENCE_ID = when(isTesting, "ff0ac6ef9b", "edb6cbfd3d");

if (isTesting) {
  marketing.setConfig({
    apiKey: "7d82215000eb46cb6bb292f53f972766-us21",
    server: "us21",
  });
} else {
  marketing.setConfig({
    apiKey: "b90601c0a376a9125c61df11f28973af-us8",
    server: "us8",
  });
}

const TAGS = ["customer", "nourisha-api"];

export class MailchimpService {
  static async AddContact(dto: CustomerDto) {
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
  }

  static async updateContactAddr(email: string, dto: Address) {
    validateFields(dto, ["address_", "city", "postcode"]);
    const email_hash = crypto.createHash("md5").update(email).digest("hex").toLowerCase();

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
  }

  static async syncCustomersToMailchimp(roles: string[]) {
    await RoleService.requiresPermission([AvailableRole.SUPERADMIN], roles, AvailableResource.CUSTOMER, [
      PermissionScope.BROADCAST,
      PermissionScope.ALL,
    ]);

    let customers = await customer.find().lean<Customer[]>().exec();
    customers = customers.filter((cus) => {
      const name = join([cus?.first_name, cus?.first_name], " ");
      return !(name ?? "").includes("test");
    });

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
          members: customers.map((cus) => ({
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
          })),
        },
        { skipMergeValidation: true }
      );
      return result;
    } catch (error) {
      console.log("Batch", error);
    }

    return;
  }

  static constructAddr(addr: Address) {
    return join([addr?.address_, addr?.city, when(!!addr?.postcode, `, ${addr?.postcode}`, ""), addr?.country].filter(Boolean), " ");
  }
}
