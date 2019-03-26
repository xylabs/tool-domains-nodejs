"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Configs extends Map {
    merge(items) {
        if (items) {
            for (const item of items.values()) {
                const existingItem = this.get(item.getKey());
                if (existingItem) {
                    this.set(existingItem.getKey(), existingItem.merge(item));
                }
                else {
                    this.set(item.getKey(), item);
                }
            }
        }
        return this;
    }
    getConfig(key) {
        const defaultItem = this.get("default");
        const item = this.get(key);
        if (item) {
            if (defaultItem) {
                return defaultItem.merge(item);
            }
            return item;
        }
        if (defaultItem) {
            return defaultItem;
        }
        return undefined;
    }
}
exports.Configs = Configs;
//# sourceMappingURL=configs.js.map