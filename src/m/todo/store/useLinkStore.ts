import {defineStore} from "pinia";
import utils from "../../common/utils/Utils";
import {db} from "../../common/store/Db";
import {Link} from "../entity/Link";

export const useLinkStore = defineStore('Link', {
    state: () => ({
        taskId: '',
        links: new Array<Link>(),
        current: new Link()
    }),
    getters: {},
    actions: {
        /**
         * 需先设置taskId
         * @param taskId
         */
        setTaskId(taskId: string) {
            this.taskId = taskId
        },
        checkTaskId() {
            if (!this.taskId) {
                throw "TaskId is undefined!"
            }
        },
        add(title: string, url: string, icon?: string,) {
            this.checkTaskId()
            const link = new Link()
            link.createDate = utils.getNowString()
            link.id = utils.uuid(16)
            link.title = title
            link.url = url
            link.taskId = this.taskId
            link.icon = icon
            db.links.add(link)
            this.setCurrent(link)
            this.links.splice(0, 0, link)
            return link
        },
        update(link: Link) {
            link.updateDate = utils.getNowString()
            return db.links.put(link)
        },
        delete(id: string) {
            return db.links.delete(id)
        },
        deleteByTaskId(taskId: string) {
            return db.links.where('taskId').equals(taskId).delete()
            // const name = 'links'
            // const fieldName = 'taskId'
            // const fieldValue = taskId
            // let ids: Array<string> = []
            // db[name].where(fieldName).equals(fieldValue).toArray().then((items) => {
            //     items.forEach(item => {
            //         ids.push(item.id)
            //     })
            //     db[name].bulkDelete(ids)
            // })
        },
        setCurrent(link: Link) {
            this.current = link
        },
        load() {
            this.checkTaskId()
            return db.links.where('taskId').equals(this.taskId).toArray().then((res) => {
                this.links = res
            })
        }
    },
})