import {defineStore} from "pinia";
import utils from "../../common/utils/Utils";
import {db} from "../../common/store/Db";
import {App} from "../entity/App";

export const useDeskTopStore = defineStore('DeskTop', {
    state: () => ({
        starApps: new Array<App>(),
        allApps: new Array<App>(),
    }),
    getters: {},
    actions: {

    },
})