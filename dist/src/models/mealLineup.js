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
exports.MealLineup = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const base_1 = __importDefault(require("./base"));
const customer_1 = require("./customer");
const mealPack_1 = require("./mealPack");
let MealLineup = class MealLineup extends base_1.default {
};
__decorate([
    (0, typegoose_1.prop)({ ref: () => customer_1.Customer }),
    __metadata("design:type", Object)
], MealLineup.prototype, "customer", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => mealPack_1.MealPack }),
    __metadata("design:type", Object)
], MealLineup.prototype, "monday", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => mealPack_1.MealPack }),
    __metadata("design:type", Object)
], MealLineup.prototype, "tuesday", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => mealPack_1.MealPack }),
    __metadata("design:type", Object)
], MealLineup.prototype, "wednesday", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => mealPack_1.MealPack }),
    __metadata("design:type", Object)
], MealLineup.prototype, "thursday", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => mealPack_1.MealPack }),
    __metadata("design:type", Object)
], MealLineup.prototype, "friday", void 0);
MealLineup = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], MealLineup);
exports.MealLineup = MealLineup;
exports.default = (0, typegoose_1.getModelForClass)(MealLineup);
//# sourceMappingURL=mealLineup.js.map