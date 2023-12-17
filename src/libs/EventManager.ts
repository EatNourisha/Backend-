import NourishaBus, { NourishaEventTypes } from "./NourishaBus";
import consola from "consola";

export default class EventManager extends Map<keyof NourishaEventTypes, (arg: any) => void> {
  static store = new EventManager();

  static addEvent<K extends keyof NourishaEventTypes>(key: K, func: (arg: NourishaEventTypes[K]) => void): boolean {
    if (this.store.has(key)) this.store.delete(key);
    const em = this.store.set(key, func);

    if (em) return true;
    return false;
  }

  static removeEvent<K extends keyof NourishaEventTypes>(key: K) {
    if (this.store.has(key)) {
      // NourishaBus.off(key, () => {});
      return this.store.delete(key);
    }
    return false;
  }

  static subscribeEvents() {
    if (this.store.size < 1) return;

    this.store.forEach((func, key) => {
      NourishaBus.on(key, func);
    });

    consola.log(`\x1b[33m[EventManager::Store]\x1b[0m \x1b[35m%s`, this.store.keys(), "listeners mounted\x1b[0m");
  }

  static unsubscribeEvents() {
    this.store.forEach((func, key) => {
      NourishaBus.off(key, func);
    });

    consola.log(`\x1b[33m[EventManager::Store]\x1b[0m \x1b[35m%s\x1b[0m`, this.store.keys(), "listeners will be removed");
    this.store.clear();
  }
}
