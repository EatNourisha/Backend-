"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setExpiration = (nDays) => {
    !nDays && (nDays = 7);
    const expiration = new Date().setTime(new Date().getTime() + 3600000 * 24 * nDays);
    return expiration;
};
exports.default = setExpiration;
//# sourceMappingURL=setExpiration.js.map