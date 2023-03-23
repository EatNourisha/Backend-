"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const utils_1 = require("../utils");
const models_1 = require("../models");
class IPasswordService {
}
class PasswordService {
    static getPassword(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = yield models_1.customer.findOne({ _id: customer_id }).select("password").lean().exec();
            if (!acc)
                throw (0, utils_1.createError)("Customer not found", 404);
            return acc.password;
        });
    }
    static addPassword(customer_id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = yield models_1.customer
                .findByIdAndUpdate(customer_id, { password: (0, bcryptjs_1.hashSync)(password, 8) }, { useFindAndModify: false })
                .lean()
                .exec();
            if (!acc)
                throw (0, utils_1.createError)("Customer not found", 404);
            return acc;
        });
    }
    static changePassword(customer_id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkPassword(customer_id, input.current_password)))
                throw (0, utils_1.createError)("Incorrect password", 401);
            const acc = yield models_1.customer
                .findByIdAndUpdate(customer_id, { password: (0, bcryptjs_1.hashSync)(input.new_password, 8) }, { useFindAndModify: false })
                .lean()
                .exec();
            return acc;
        });
    }
    static checkPassword(customer_id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHashInDb = yield this.getPassword(customer_id);
            return (0, bcryptjs_1.compareSync)(password, passwordHashInDb);
        });
    }
}
exports.default = PasswordService;
//# sourceMappingURL=password.service.js.map