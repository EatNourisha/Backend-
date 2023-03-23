"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUpdateOptions = () => {
    return {
        runValidators: true,
        setDefaultsOnInsert: true,
        upsert: true,
        new: true,
    };
};
exports.default = getUpdateOptions;
//# sourceMappingURL=getUpdateOptions.js.map