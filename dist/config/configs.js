"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Configs extends Map {
    merge(items) {
        if (items) {
            for (const item of items.values()) {
                const existingItem = this.get(item.key);
                if (existingItem) {
                    this.set(existingItem.key, existingItem.merge(item));
                }
                else {
                    this.set(item.key, item);
                }
            }
        }
        return this;
    }
    toJSON() {
        const obj = [];
        for (const item of this.values()) {
            obj.push(item);
        }
        return obj;
    }
    // we pass in a new object to prevent writing to authority objects
    getConfig(key, newObject) {
        const defaultItem = this.get("default");
        const item = this.get(key);
        if (item) {
            if (defaultItem) {
                return newObject.merge(defaultItem).merge(item);
            }
            return item;
        }
        if (defaultItem) {
            return newObject.merge(defaultItem);
        }
        return undefined;
    }
}
exports.Configs = Configs;
//# sourceMappingURL=configs.js.map