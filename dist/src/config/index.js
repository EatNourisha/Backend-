"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = {
    PORT: process.env.PORT || 8080,
    NAME: process.env.NAME,
    VERSION: process.env.VERSION,
    DB_URI: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    SENDGRID_KEY: process.env.SENDGRID_KEY,
    SEND_IN_BLUE_KEY: process.env.SEND_IN_BLUE_KEY,
    CMC_PRO_API_KEY: "16d9c3b6-4d24-4d36-8b57-3842702aca1b",
    paystackCallbackUrl: "",
    ANNUAL_PERCENTAGE_RATE: 3.2,
    VERIFY_ME_KEY: process.env.VERIFY_ME_KEY,
    PAYSTACK_AUTHORIZATION: process.env.PAYSTACK_AUTHORIZATION,
    APPRUVE_KEY: process.env.APPRUVE_KEY,
};
exports.default = config;
//# sourceMappingURL=index.js.map