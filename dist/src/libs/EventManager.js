"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NourishaBus_1 = __importDefault(require("./NourishaBus"));
const consola_1 = __importDefault(require("consola"));
class EventManager extends Map {
    static addEvent(key, func) {
        if (this.store.has(key))
            this.store.delete(key);
        const em = this.store.set(key, func);
        if (em)
            return true;
        return false;
    }
    static removeEvent(key) {
        if (this.store.has(key))
            return this.store.delete(key);
        return false;
    }
    static subscribeEvents() {
        this.store.forEach((func, key) => {
            NourishaBus_1.default.on(key, func);
        });
        consola_1.default.log(`\x1b[33m[EventManager::Store]\x1b[0m \x1b[35m%s`, this.store.keys(), "listeners mounted\x1b[0m");
    }
    static unsubscribeEvents() {
        this.store.forEach((func, key) => {
            NourishaBus_1.default.off(key, func);
        });
        consola_1.default.log(`\x1b[33m[EventManager::Store]\x1b[0m \x1b[35m%s\x1b[0m`, this.store.keys(), "listeners will be removed");
        this.store.clear();
    }
}
exports.default = EventManager;
EventManager.store = new EventManager();
//# sourceMappingURL=EventManager.js.map