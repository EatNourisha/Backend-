import { CustomerDto } from "../../interfaces";
import { makeRequest } from "../../utils";
import { TAGS } from "./marketing.service";

const API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNWMyNzI4Y2M5MDI2NjBjN2UzNDQzOGU1NzFmNGYyYzQ3YWFkMThkMmQwZDI0NmViYzMyMTQyYjdmZjg3ZThiNTYzN2M3YjJlZGM4ODMxNGQiLCJpYXQiOiIxNzAzMDY1ODg5LjM2MDY2MyIsIm5iZiI6IjE3MDMwNjU4ODkuMzYwNjcxIiwiZXhwIjoiNDg1NjY2NTg4OS4zNTc1MDMiLCJzdWIiOiI4MzA5NjMiLCJzY29wZXMiOltdfQ.qmlqStKJgper2rmJGrygq5HB3nD08dghG3ISiH3Z61LulkqToCdHmLLnjRFLIn35h6EFdKGulhWJcp68dhvsbw";
export class SenderService {
  static async addContact(dto: CustomerDto) {
    try {
      const result = await makeRequest<any, any>({
        url: "https://api.sender.net/v2/subscribers",
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        httpAgent: "Nourisha",
        httpsAgent: "Nourisha",
        data: {
          email: dto?.email,
          firstname: dto?.first_name,
          lastname: dto?.last_name,
          groups: TAGS,
          phone: dto?.phone,
          // fields: {},
          "trigger_automation": false
        },
      });

      return result;
    } catch (error) {
      console.log("[SenderService:addContact]", error);
      return null;
    }
  }

  static getHeaders() {
    return {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }
}
