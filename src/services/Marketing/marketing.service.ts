import { CustomerDto, UpdateContactSubscriptionDto } from "../../interfaces";
import { MailchimpService } from "./mailchimp.service";
import { SenderService } from "./sender.service";
import customer, { Address } from "../../models/customer";
import axios from "axios";
import { emailSender } from "./bluePrint.service";


enum ChannelType {
  MAILCHIMP = "mailchimp",
  SENDER = "sender",
}

interface IMethod {
  addContact: (dto: CustomerDto) => Promise<any>;
  updateContactAddr: (email: string, dto: Address) => Promise<any>;
  syncCustomersToContacts: (roles: string[]) => Promise<any>;
  updateContactSubscription: (email: string, dto: UpdateContactSubscriptionDto) => Promise<any>;
}

type IMethodName = keyof IMethod;

export const TAGS = ["customer", "nourisha-api", "api-test"];

export class MarketingService {
  static channel: ChannelType = ChannelType.SENDER;

  static async addContact(dto: CustomerDto): Promise<any> {
    const method = this.selectMethod("addContact");
    if (!method) return;
    return await method(dto);
  }

  static async updateContactAddr(email: string, dto: Address): Promise<any> {
    const method = this.selectMethod("updateContactAddr");
    if (!method) return;
    return await method(email, dto);
  }

  static async updateContactSubscription(email: string, dto: UpdateContactSubscriptionDto): Promise<any> {
    const method = this.selectMethod("updateContactSubscription");
    if (!method) return;
    return await method(email, dto);
  }

  static async syncCustomersToContacts(roles: string[]): Promise<any> {
    const method = this.selectMethod("syncCustomersToContacts");
    if (!method) return;
    return await method(roles);
  }

  static selectMethod<N extends IMethodName>(method_name: N): IMethod[N] | null {
    switch (this.channel) {
      case ChannelType.MAILCHIMP:
        return MailchimpService[method_name as any];
      case ChannelType.SENDER:
        return SenderService[method_name as any];
      default:
        return null;
    }
  }
}

//****************************************************** */
// Marketing Email Blueprint
//****************************************************** */

export async function sendOrderAlert(email: string[], payload: any, ){
  const cus = await customer.findById(payload.customer)
const body =
  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lineup Notification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              color: #333;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
          }
  
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
  
          .email-header {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
          }
  
          .email-body {
              font-size: 17px;
              margin-bottom: 20px;
          }
  
          .email-details {
              background-color: #f1f1f1;
              padding: 10px;
              border-radius: 5px;
              font-size: 15px;
          }
  
          .email-details p {
              margin: 5px 0;
          }
  
          .email-footer {
              font-size: 14px;
              color: #777;
              text-align: center;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">
              Dear Kitchen Team,
          </div>
  
          <div class="email-body">
              ${cus?.first_name} ${cus?.last_name} just placed an order. Kindly check the dashboard for detailed information about the order. 
          </div>
  
          <div class="email-details">
              <p><strong>Delivery Date:</strong> ${new Date(payload.deliveryDate).toDateString()}</p>
          </div>
  
      </div>
  </body>
  </html>
         `

  await emailSender(body, email, payload.subject,)


}

export async function sendEmailKlaviyo(
  to: string,
  subject: string,
  htmlBody: string,
  textBody: string
) {
  const API_KEY = process.env.KLAVIYO_API_KEY;

  const data = {
    data: {
      type: "event",
      attributes: {
        profile: {
          data: {
            type: "profile",
            attributes: {
              email: to,
            },
          },
        },
        metric: {
          data: {
            type: "metric",
            attributes: {
              name: "Zuby Sent",
            },
          },
        },
        properties: {
          subject,
          htmlContent: htmlBody,
          textContent: textBody,
        },
        time: new Date().toISOString(), 
      },
    },
  };

  try {
    const response = await axios.post('https://a.klaviyo.com/api/events', data, {
      method: 'POST',
      headers: {
        accept: 'application/vnd.api+json',
        revision: '2024-10-15',
        'content-type': 'application/vnd.api+json',
        Authorization: `Klaviyo-API-Key ${API_KEY}`,      }, 
    });
    console.log('Email event logged successfully:', response.data);
} catch (error) {
  console.error('Failed to log email event:', error.response?.data || error || error.message);
}
}

export async function sendBrevoEmail( email: string) {
  const url = 'https://api.brevo.com/v3/smtp/email';
  const apiKey = process.env.BREVO_KEY;
  const subject = 'Test Email from Brevo';
  const body = '<h1>Hello!</h1><p>This is a test email.</p>';

  const payload = {
    sender: {
      email: 'Kitchen@eatnourisha.com', 
      name: 'Nourisha',
    },
    to: [
      {
        email: email,
      },
    ],
    subject: subject,
    htmlContent: body, 
  };

  const headers = {
    'Content-Type': 'application/json',
    'api-key': apiKey,
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error);
    throw error;
  }
}

 