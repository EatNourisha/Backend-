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
exports.AuthVerification = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const valueObjects_1 = require("../valueObjects");
const base_1 = __importDefault(require("./base"));
const customer_1 = require("./customer");
let AuthVerification = class AuthVerification extends base_1.default {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], AuthVerification.prototype, "code", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], AuthVerification.prototype, "token", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], AuthVerification.prototype, "exp", void 0);
__decorate([
    (0, typegoose_1.prop)({ index: true, ref: () => customer_1.Customer }),
    __metadata("design:type", Object)
], AuthVerification.prototype, "customer_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ index: true }),
    __metadata("design:type", Boolean)
], AuthVerification.prototype, "verified", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: valueObjects_1.AuthVerificationReason }),
    __metadata("design:type", String)
], AuthVerification.prototype, "reason", void 0);
AuthVerification = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], AuthVerification);
exports.AuthVerification = AuthVerification;
exports.default = (0, typegoose_1.getModelForClass)(AuthVerification);
//# sourceMappingURL=authVerification.js.map