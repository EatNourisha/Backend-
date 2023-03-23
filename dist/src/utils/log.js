"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function log(tag, ...args) {
    console.log(`\x1b[33m[${tag}]\x1b[0m\x1b[34m`, ...args, "\x1b[0m");
}
exports.default = log;
//# sourceMappingURL=log.js.map