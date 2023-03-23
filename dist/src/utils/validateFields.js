"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function default_1(input, requiredFields) {
    const keys = Object.keys(input);
    const missingFields = [];
    console.log("Required fields", requiredFields);
    requiredFields.forEach((key) => {
        if (!keys.includes(key))
            missingFields.push(key);
    });
    const len = missingFields.length;
    if (len > 0)
        throw (0, _1.createError)(`${missingFields.join(", ")} field${len < 2 ? "" : "s"} ${len === 1 ? "is" : "are"} required`, 400);
}
exports.default = default_1;
//# sourceMappingURL=validateFields.js.map