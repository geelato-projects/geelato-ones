import {defineStore} from "pinia";
import utils from "../../common/utils/Utils";
import {db} from "../../common/store/Db";
import {Checklist} from "../entity/Checklist";

export const useChecklistStore = defineStore('Checklist', {
    state: () => ({
        taskId: '',
        items: new Array<Checklist>(),
        current: new Checklist()
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
        add(content: string) {
            this.checkTaskId()
            const instance = new Checklist()
            instance.createDate = utils.getNowString()
            instance.id = utils.uuid(16)
            instance.taskId = this.taskId
            instance.content = content
            instance.statusId = '10'
            db.checklists.add(instance)
            this.setCurrent(instance)
            this.items.splice(0, 0, instance)
            return instance
        },
        update(checklist: Checklist) {
            checklist.updateDate = utils.getNowString()
            db.checklists.put(checklist)
        },
        delete(id: string) {
            return db.checklists.delete(id)
        },
        deleteByTaskId(taskId: string) {
            return db.checklists.where('taskId').equals(taskId).delete()
        },
        setCurrent(checklist: Checklist) {
            this.current = checklist
        },
        load() {
            this.checkTaskId()
            return db.checklists.where('taskId').equals(this.taskId).toArray().then((res) => {
                this.items = res
            })
        }
    },
})