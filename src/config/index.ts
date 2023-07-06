import "dotenv/config";

const config = {
  PORT: process.env.PORT || 8080,
  NAME: process.env.NAME as string,
  VERSION: process.env.VERSION as string,
  DB_URI: process.env.DATABASE_URL as string,
  // DB_URI: process.env.DATABASE_URL_PROD as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE as string,
  SENDGRID_KEY: process.env.SENDGRID_KEY as string,
  SEND_IN_BLUE_KEY: process.env.SEND_IN_BLUE_KEY as string,
  MAILGUN_KEY: process.env.MAILGUN_KEY as string,
  CMC_PRO_API_KEY: "16d9c3b6-4d24-4d36-8b57-3842702aca1b",
  paystackCallbackUrl: "",
  ANNUAL_PERCENTAGE_RATE: 3.2,

  STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  ENDPOINT_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,

  isTesting: true,
};

export default config;
