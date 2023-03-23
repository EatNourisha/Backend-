"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = exports.DeliveryDay = exports.Address = exports.AccountControl = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const valueObjects_1 = require("../valueObjects");
const base_1 = __importDefault(require("./base"));
const role_1 = require("./role");
class AccountControl {
}
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], AccountControl.prototype, "suspended", void 0);
exports.AccountControl = AccountControl;
class Address {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Address.prototype, "address_", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Address.prototype, "postcode", void 0);
exports.Address = Address;
var DeliveryDay;
(function (DeliveryDay) {
    DeliveryDay["MONDAY"] = "monday";
    DeliveryDay["TUESDAY"] = "tuesday";
    DeliveryDay["WEDNESDAY"] = "wednesday";
    DeliveryDay["THURSDAY"] = "thursday";
    DeliveryDay["FRIDAY"] = "friday";
    DeliveryDay["SATURDAY"] = "saturday";
    DeliveryDay["SUNDAY"] = "sunday";
})(DeliveryDay = exports.DeliveryDay || (exports.DeliveryDay = {}));
let Customer = class Customer extends base_1.default {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Customer.prototype, "first_name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Customer.prototype, "last_name", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Customer.prototype, "avatar", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true, lowercase: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ select: false }),
    __metadata("design:type", String)
], Customer.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Customer.prototype, "primary_role", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], Customer.prototype, "last_seen", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: valueObjects_1.Gender }),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Address, _id: false }),
    __metadata("design:type", Address)
], Customer.prototype, "address", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => role_1.Role }),
    __metadata("design:type", Array)
], Customer.prototype, "roles", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => AccountControl, _id: false }),
    __metadata("design:type", AccountControl)
], Customer.prototype, "control", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_email_verified", void 0);
__decorate([
    (0, typegoose_1.prop)({ index: true, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "ref_code", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: DeliveryDay }),
    __metadata("design:type", String)
], Customer.prototype, "delivery_day", void 0);
Customer = __decorate([
    (0, typegoose_1.index)({ "$**": "text" }),
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], Customer);
exports.Customer = Customer;
exports.default = (0, typegoose_1.getModelForClass)(Customer);
//# sourceMappingURL=customer.js.map