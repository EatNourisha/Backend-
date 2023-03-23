"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._NourishaBus = void 0;
const emittery_1 = __importDefault(require("emittery"));
emittery_1.default.isDebugEnabled = false;
class _NourishaBus extends emittery_1.default {
    constructor() {
        super();
    }
}
exports._NourishaBus = _NourishaBus;
const NourishaBus = new _NourishaBus();
exports.default = NourishaBus;
//# sourceMappingURL=NourishaBus.js.map