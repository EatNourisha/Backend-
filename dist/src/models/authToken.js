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
exports.AuthToken = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const base_1 = __importDefault(require("./base"));
let AuthToken = class AuthToken extends base_1.default {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], AuthToken.prototype, "token", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], AuthToken.prototype, "exp", void 0);
__decorate([
    (0, typegoose_1.prop)({ index: true }),
    __metadata("design:type", String)
], AuthToken.prototype, "customer_id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], AuthToken.prototype, "last_login", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], AuthToken.prototype, "device_id", void 0);
AuthToken = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], AuthToken);
exports.AuthToken = AuthToken;
exports.default = (0, typegoose_1.getModelForClass)(AuthToken);
//# sourceMappingURL=authToken.js.map