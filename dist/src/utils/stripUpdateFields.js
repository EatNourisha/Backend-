"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stripUpdateFields = (model) => {
    if (!model)
        return model;
    delete model["_id"];
    delete model["createdAt"];
    delete model["updatedAt"];
    return model;
};
exports.default = stripUpdateFields;
//# sourceMappingURL=stripUpdateFields.js.map