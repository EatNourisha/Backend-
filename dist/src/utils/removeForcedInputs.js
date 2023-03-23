"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const omit_1 = __importDefault(require("lodash/omit"));
function removeForcedInputs(input, toRemove) {
    let _input = Object.assign({}, (0, omit_1.default)(input, toRemove));
    return _input;
}
exports.default = removeForcedInputs;
//# sourceMappingURL=removeForcedInputs.js.map