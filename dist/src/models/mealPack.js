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
exports.MealPack = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const base_1 = __importDefault(require("./base"));
const meal_1 = require("./meal");
let MealPack = class MealPack extends base_1.default {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], MealPack.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ lowercase: true }),
    __metadata("design:type", String)
], MealPack.prototype, "slug", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => meal_1.Meal }),
    __metadata("design:type", Array)
], MealPack.prototype, "meals", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], MealPack.prototype, "image_url", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: true }),
    __metadata("design:type", Boolean)
], MealPack.prototype, "is_available", void 0);
MealPack = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], MealPack);
exports.MealPack = MealPack;
exports.default = (0, typegoose_1.getModelForClass)(MealPack);
//# sourceMappingURL=mealPack.js.map