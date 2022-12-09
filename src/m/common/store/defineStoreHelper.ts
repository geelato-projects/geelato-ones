import {App} from "../../desktop/entity/App";
import {db} from "./Db";

function buildStore<T>(id: string, tableName: string) {
    return {
        state: () => ({
            items: new Array<T>()
        }),
        getters: {},
        actions: {
            add: (instance: T) => {
                // @ts-ignore
                return db[tableName].add(instance)
            },
            update: (instance: T) => {
                // @ts-ignore
                return db[tableName].put(instance)
            },
            delete: (id: string) => {
                // @ts-ignore
                return db[tableName].delete(id)
            },
            queryAll: () => {
                db.apps.toArray().then((res) => {
                    // @ts-ignore
                    this.items = res
                })
            },
            queryByField: (key: string, value: any) => {
                // @ts-ignore
                return db[tableName].where(key).equals(value).toArray()
            },
            get: (id: string) => {
                // @ts-ignore
                return db[tableName].get(id)
            }
        },
    }
}
