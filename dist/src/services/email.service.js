"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const hbs = __importStar(require("handlebars"));
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
mail_1.default.setApiKey(config_1.default.SENDGRID_KEY);
var Template;
(function (Template) {
    Template["VERIFICATION"] = "/emails/verification.html";
    Template["RESET_PASSWORD"] = "/emails/resetPassword.html";
    Template["ADMIN_INVITE"] = "/emails/adminRegistrationRequest.html";
    Template["GUARANTOR_INVITE"] = "/emails/guarantorsInvite.html";
    Template["GUARANTOR_REJECTION"] = "/emails/guarantorRejected.html";
    Template["GUARANTOR_VERFICATION"] = "/emails/guarantorVerified.html";
    Template["INITIAL_PAYMENT"] = "/emails/initialPayment.html";
    Template["WEEKLY_PAYMENT"] = "/emails/weeklyPayment.html";
    Template["LOAN_REQUEST"] = "/emails/loanRequest.html";
    Template["LOAN_REJECTED"] = "/emails/loanRejected.html";
    Template["LOAN_REPAYMENT"] = "/emails/loanRepayment.html";
    Template["SERVICE_SCHEDULE"] = "/emails/serviceSchedule.html";
    Template["APPLICATION_APPROVED"] = "/emails/applicationApproved.html";
    Template["APPLICATION_REJECTED"] = "/emails/applicationRejected.html";
    Template["APPLICATION_UNDER_REVIEW"] = "/emails/applicationUnderReview.html";
})(Template = exports.Template || (exports.Template = {}));
class EmailService {
    static sendEmail(subject, email, _template, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = fs.readFileSync(path.join(__dirname, "..", _template.toString())).toString();
            const template = hbs.compile(html), htmlToSend = template(data);
            try {
                yield mail_1.default.send({
                    from: {
                        name: "Rapyd",
                        email: "rapydcarsltd@gmail.com",
                    },
                    subject,
                    to: email,
                    html: htmlToSend,
                });
            }
            catch (error) {
                console.log(error);
                throw (0, utils_1.createError)(error.message, 500);
            }
        });
    }
}
exports.default = EmailService;
//# sourceMappingURL=email.service.js.map