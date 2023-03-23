"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEvent = void 0;
const libs_1 = require("../libs");
function addEvent(key) {
    return function (_, __, descriptor) {
        libs_1.EventManager.addEvent(key, descriptor.value);
    };
}
exports.addEvent = addEvent;
//# sourceMappingURL=event.decorator.js.map