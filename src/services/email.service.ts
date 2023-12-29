// import { ContactsApi, ContactsApiApiKeys, CreateContact } from "sib-api-v3-typescript";

import sgMail from "@sendgrid/mail";

// import FormData from 'form-data';
// import Mailgun from 'mailgun.js'

import * as fs from "fs";
import * as path from "path";
import * as hbs from "handlebars";

import config, { isTesting } from "../config";
import { when } from "../utils/when";
import { createError } from "../utils";
import nodemailer from "nodemailer";
import { ServerClient } from "postmark";

// const mailgun = new Mailgun(FormData);
// const mg = mailgun.client({username: 'api', key: config.MAILGUN_KEY});

// Configure API key authorization: api-key
// const apiInstance = new ContactsApi();
// apiInstance.setApiKey(ContactsApiApiKeys.apiKey, config.SEND_IN_BLUE_KEY);

var postmark_serverToken = "xxxx-xxxxx-xxxx-xxxxx-xxxxxxXXXX";
var postmark_client = new ServerClient(postmark_serverToken);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "support@eatnourisha.com",
    // pass: "",
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
} as any);

sgMail.setApiKey(config.SENDGRID_KEY);

if (isTesting && false)
  console.log(
    `\n\n\n-------------------------- SENDGRID KEY -----------------------------\n${config.SENDGRID_KEY}\n---------------------------------------------------------------------\n\n\n`
  );

export enum Template {
  VERIFICATION = "/emails/verification.html", // {name: '', link: '', code: ''}
  RESET_PASSWORD_WEB = "/emails/resetPassword__web.html", // {name: '', link: ''}
  RESET_PASSWORD_MOBILE = "/emails/resetPassword__mobile.html", // {name: '', code: ''}
  WELCOME = "/emails/welcome.html", // {name: ''}
  ORDERCREATED = "/emails/orderCreated.html", // {name: '', order_ref_id: '', delivery_date: '', delivery_address: ''}
}

type SendViaType = "sendgrid" | "mailgun" | "nodemailer" | "postmark";

export class EmailService {
  static async sendEmail(subject: string, email: string, _template: Template, data: any) {
    // const via: SendViaType = "sendgrid";
    const via: SendViaType = "nodemailer";

    switch (via) {
      case "sendgrid" as any:
        return await this.sendEmail_sendgrid(subject, email, _template, data);
      case "mailgun" as any:
        // return await this.sendEmail_mailgun(subject, email, _template, data)
        return;
      case "nodemailer" as any:
        return await this.sendEmail_nodemailer(subject, email, _template, data);
      case "postmark" as any:
        return await this.sendEmail_postmark(subject, email, _template, data);
      default:
        break;
    }
  }

  static async sendEmail_sendgrid(subject: string, email: string, _template: Template, data: any) {
    const html = fs.readFileSync(path.join(__dirname, "..", _template.toString())).toString();

    const template = hbs.compile(html),
      htmlToSend = template(data);

    let result: any;

    try {
      result = await sgMail.send({
        from: {
          name: "Nourisha",
          email: "help@eatnourisha.com",
        },
        subject,
        to: email,
        html: htmlToSend,
      });

      return when(isTesting, { ...result, key: config.SENDGRID_KEY }, result);
    } catch (error) {
      console.log("Sendgrid Error:", error);
      throw createError(error.message, 500);
    }

    return result;
  }

  static async sendEmail_postmark(subject: string, email: string, _template: Template, data: any) {
    const html = fs.readFileSync(path.join(__dirname, "..", _template.toString())).toString();

    const template = hbs.compile(html),
      htmlToSend = template(data);

    let result: any;

    try {
      result = await postmark_client.sendEmail({
        From: "support@eatnourisha.com",
        To: email,
        Subject: subject,
        HtmlBody: htmlToSend,
      });

      return result;
    } catch (error) {
      console.log("Postmark Error:", error);
      // throw createError(error.message, 500);
      /// Try sending via SMTP
      return await this.sendEmail_nodemailer(subject, email, _template, data);
    }
  }

  static async sendEmail_mailgun(subject: string, email: string, _template: Template, data: any) {
    const html = fs.readFileSync(path.join(__dirname, "..", _template.toString())).toString();
    const template = hbs.compile(html),
      htmlToSend = template(data);

    let result: any;

    try {
      // result = await mg.messages.create('eatnourisha.com', {
      //   from: "Eat Nourisha <help@eatnourisha.com>",
      //   to: [email],
      //   subject,
      //   html: htmlToSend
      // })

      result = {};
      console.log(htmlToSend, subject, email);
    } catch (error) {
      console.error("[MAILGUN::ERROR]", error);
    }

    return result;
  }

  static async sendEmail_nodemailer(subject: string, email: string, _template: Template, data: any) {
    const html = fs.readFileSync(path.join(__dirname, "..", _template.toString())).toString();
    const template = hbs.compile(html),
      htmlToSend = template(data);

    let result: any;

    try {
      // result = await mg.messages.create('eatnourisha.com', {
      //   from: "Eat Nourisha <help@eatnourisha.com>",
      //   to: [email],
      //   subject,
      //   html: htmlToSend
      // })

      const result = await new Promise((resolve, reject) => {
        transporter.sendMail(
          {
            from: {
              name: "Nourisha",
              address: "support@eatnourisha.com",
            },
            subject,
            to: email,
            html: htmlToSend,
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      // result = {};
      // console.log(htmlToSend, subject, email);
      console.log(result);
      return result;
    } catch (error) {
      console.error("[MAILGUN::ERROR]", error);
    }

    return result;
  }

  static async sendMailgunTestEmail() {
    // const result = await mg.messages.create('sandbox3a0fb15bfab14b34afc646e7e9b21545.mailgun.org', {
    //   from: "Excited User <mailgun@sandbox3a0fb15bfab14b34afc646e7e9b21545.mailgun.org>",
    //   to: ["famuyiwadayodaniel@gmail.com"],
    //   subject: "Hello, Testing Mailgun",
    //   text: "Testing some Mailgun awesomeness!",
    //   html: "<h1>Testing some Mailgun awesomeness!</h1>"
    // })

    // console.log("Mailgun Test", result)

    return {};
  }
}
