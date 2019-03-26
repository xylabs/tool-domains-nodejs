import _ from 'lodash'
import { Config } from './config'

export class Configs<T extends Config> extends Map<string, T> {

  public merge(items?: Configs<T>) {
    if (items) {
      for (const item of items.values()) {
        const existingItem = this.get(item.getKey())
        if (existingItem) {
          this.set(existingItem.getKey(), existingItem.merge(item))
        } else {
          this.set(item.getKey(), item)
        }
      }
    }
    return this
  }

  public getConfig(key: string): T | undefined {
    const defaultItem = this.get("default")
    const item = this.get(key)
    if (item) {
      if (defaultItem) {
        return defaultItem.merge(item)
      }
      return item
    }
    if (defaultItem) {
      return defaultItem
    }
    return undefined
  }
}
