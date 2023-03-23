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
exports.Permission = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const valueObjects_1 = require("../valueObjects");
const resource_1 = require("./resource");
const base_1 = __importDefault(require("./base"));
const role_1 = require("./role");
class Scope {
}
__decorate([
    (0, typegoose_1.prop)({ enum: valueObjects_1.PermissionScope, _id: false, unique: false }),
    __metadata("design:type", String)
], Scope.prototype, "name", void 0);
let Permission = class Permission extends base_1.default {
};
__decorate([
    (0, typegoose_1.prop)({ ref: () => role_1.Role }),
    __metadata("design:type", Object)
], Permission.prototype, "role", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => resource_1.Resource }),
    __metadata("design:type", Object)
], Permission.prototype, "resource", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Scope }),
    __metadata("design:type", Array)
], Permission.prototype, "scopes", void 0);
Permission = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], Permission);
exports.Permission = Permission;
exports.default = (0, typegoose_1.getModelForClass)(Permission);
//# sourceMappingURL=rolePermission.js.map