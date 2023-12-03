import "dotenv/config";

const config = {
  PORT: process.env.PORT || 8080,
  NAME: process.env.NAME as string,
  // VERSION: process.env.VERSION as string,
  VERSION: "1.1.25",
  DB_URI: process.env.DATABASE_URL as string,
  // DB_URI: process.env.DATABASE_URL_PROD as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE as string,
  SENDGRID_KEY: process.env.SENDGRID_KEY as string,
  SEND_IN_BLUE_KEY: process.env.SEND_IN_BLUE_KEY as string,
  MAILGUN_KEY: process.env.MAILGUN_KEY as string,
  CMC_PRO_API_KEY: "16d9c3b6-4d24-4d36-8b57-3842702aca1b",
  paystackCallbackUrl: "",

  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL as string,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY as string,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID as string,

  STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  ENDPOINT_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,

  ENVIRONMENT: process.env.ENVIRONMENT as string,
  REDIS_URL: process.env.REDIS_URL as string,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN as string,
};

export const isTesting = ["staging", "development"].includes(config.ENVIRONMENT ?? "development");
export const isProd = !isTesting;
export default config;
