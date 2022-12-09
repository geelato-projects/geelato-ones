import {defineStore} from "pinia";
import utils from "../../common/utils/Utils";
import {db} from "../../common/store/Db";
import {App} from "../entity/App";

export const useAppStore = defineStore('App', {
    state: () => ({
        items: new Array<App>(),
        currentItem: new App()
    }),
    getters: {},
    actions: {
        add(instance: App) {
            instance.setCreateInfo()
            return db.apps.add(instance)
        },
        update(instance: App) {
            return db.apps.put(instance)
        },
        delete(id: string) {
            return db.apps.delete(id)
        },
        async loadAll() {
            const _this = this
            await db.apps.toArray().then((res) => {
                // @ts-ignore
                _this.items = res
                if (res.length > 0) {
                    // @ts-ignore
                    _this.currentItem = res[0]
                }
            })
        },
        queryAll() {
            return db.apps.toArray()
        },
        queryByField(key: string,) {
            return db.apps.toArray()
        },
        get(id: string) {
            return db.apps.get(id)
        }
    },
})

