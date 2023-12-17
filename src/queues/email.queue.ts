import { Queue, Worker, Job } from "bullmq";
import { connection } from "./connection";
import { EmailService, Template } from "../services";
import {
  SendResetPasswordEmailMobileDto,
  SendResetPasswordEmailWebDto,
  SendVerificationEmailDto,
  SendWelcomeEmailDto,
} from "../interfaces";
// import Bull, { Job } from "bull";

const QUEUE_NAME = "emailq";

export const known_email_jobs = [
  "send_verification_email",
  "send_welcome_email",
  "send_resetpassword_email_web",
  "send_resetpassword_email_mobile",
] as const;
export type KnowEmailJobType = (typeof known_email_jobs)[number];

// // Create a new connection in every instance
export const EmailQueue = new Queue<any, any, KnowEmailJobType>(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    priority: 1,
    attempts: 10,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export const EmailWorker = new Worker(QUEUE_NAME, emailProcessor, { connection });

async function emailProcessor(job: Job<any, any, KnowEmailJobType>) {
  // console.log("New Email Job", job)
  switch (job.name) {
    case "send_verification_email":
      return await sendVerificationEmail(job);
    case "send_welcome_email":
      return await sendWelcomeEmail(job);
    case "send_resetpassword_email_web":
      return await sendResetPasswordEmail__Web(job);
    case "send_resetpassword_email_mobile":
      return await sendResetPasswordEmail__Mobile(job);
    default:
      throw new Error(`Job(EmailQueue) ${job.name} not processed!`);
  }
}

// export const EmailQueue = new Bull(QUEUE_NAME, {
//   redis: "127.0.0.1:6379",
// });

// EmailQueue.process(emailProcessor);

// async function emailProcessor(job: Job<any>) {
//   // console.log("New Email Job", job)
//   switch (job.data.type) {
//     case "send_verification_email":
//       return await sendVerificationEmail(job);
//     // case 'send_welcome_email':
//     //     return await sendWelcomeEmail(job);
//     // case 'send_welcome_email':
//     //     return await sendResetPasswordEmail(job);
//     default:
//       console.warn(`Job(EmailQueue) ${job.name} not processed!`);
//       break;
//   }
// }

// async function sendVerificationEmail(job: Job<any>) {
//   console.log("Send Verification Email", job.data);
//   return;
// }

async function sendVerificationEmail(job: Job<SendVerificationEmailDto, any, KnowEmailJobType>) {
  const data = job.data;
  console.log("Send Verification Email", data);
  return await EmailService.sendEmail("📧 Verify your email address", data?.email, Template.VERIFICATION, data);
}

async function sendWelcomeEmail(job: Job<SendWelcomeEmailDto, any, KnowEmailJobType>) {
  const data = job.data;
  console.log("Send Welcome Email", data);
  return await EmailService.sendEmail("Welcome to Nourisha", data?.email, Template.WELCOME, data);
}

async function sendResetPasswordEmail__Web(job: Job<SendResetPasswordEmailWebDto, any, KnowEmailJobType>) {
  const data = job.data;
  console.log("Send Reset Password Email - Web", job.data);
  return await EmailService.sendEmail("🥹 Reset password", data?.email, Template.RESET_PASSWORD_WEB, data);
}

async function sendResetPasswordEmail__Mobile(job: Job<SendResetPasswordEmailMobileDto, any, KnowEmailJobType>) {
  const data = job.data;
  console.log("Send Reset Password Email - Mobile", job.data);
  return await EmailService.sendEmail("🥹 Reset password", data?.email, Template.RESET_PASSWORD_MOBILE, data);
}

export const EmailQ = { Queue: EmailQueue, Worker: EmailWorker };
// export const EmailQ = { Queue: EmailQueue };
