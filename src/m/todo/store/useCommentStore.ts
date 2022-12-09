import {defineStore} from "pinia";
import utils from "../../common/utils/Utils";
import {Comment} from "../entity/Comment";
import {db} from "../../common/store/Db";

export const useCommentStore = defineStore('Comment', {
    state: () => ({
        taskId: '',
        comments: new Array<Comment>(),
        current: new Comment()
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
        add(title: string, content?: string) {
            this.checkTaskId()
            const instance = new Comment()
            instance.createDate = utils.getNowString()
            instance.id = utils.uuid(16)
            instance.taskId = this.taskId
            instance.title = title
            instance.content = content
            db.comments.add(instance)
            this.setCurrent(instance)
            this.comments.splice(0, 0, instance)
            return instance
        },
        update(comment: Comment) {
            comment.updateDate = utils.getNowString()
            db.comments.put(comment)
        },
        delete(id: string) {
            return db.comments.delete(id)
        },
        deleteByTaskId(taskId: string) {
            return db.comments.where('taskId').equals(taskId).delete()
        },
        setCurrent(comment: Comment) {
            this.current = comment
        },
        load() {
            this.checkTaskId()
            return db.comments.where('taskId').equals(this.taskId).toArray().then((res) => {
                this.comments = res
            })
        }
    },
})