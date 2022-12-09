import {defineStore} from "pinia";
import {Task} from "../entity/Task";
import utils from "../../common/utils/Utils";
import {db} from "../../common/store/Db";
import {useLinkStore} from "./useLinkStore";
import {useCommentStore} from "./useCommentStore";
import {ListTaskMap} from "../entity/ListTaskMap";
import {useChecklistStore} from "./useCheckListStore";
import {toRaw} from "vue";
import dayjs from "dayjs";

export const useTaskStore = defineStore('Task', {
    state: () => ({
        listId: '',
        tasks: new Array<Task>(),
        currentTask: new Task()
    }),
    getters: {},
    actions: {
        setListId(listId: string) {
            this.listId = listId
        },
        addTask(title: string) {
            if (!title) {
                return
            }
            const task = new Task()
            task.createDate = utils.getNowString()
            task.id = utils.uuid(16)
            task.title = title

            const listTaskMap: ListTaskMap = new ListTaskMap()
            listTaskMap.taskId = task.id
            listTaskMap.listId = this.listId
            listTaskMap.id = utils.uuid(16)
            listTaskMap.createDate = utils.getNowString()

            console.log('db.tasks.add(task):', task)
            db.tasks.add(task)
            db.listTaskMap.add(listTaskMap)

            // this.currentTask = task
            this.setCurrentTask(task)
            this.tasks.splice(0, 0, task)
            return task
        },
        /**
         * 修改更新task
         * @param task
         */
        updateTask(task: Task) {
            console.log('updateTask:', task)
            task.updateDate = utils.getNowString()
            return db.tasks.put(task)
        },
        async deleteTask(id: string) {
            console.log('deleteTask:', id)
            await db.tasks.delete(id)
            await db.listTaskMap.where('taskId').equals(id).delete()
            await useLinkStore().deleteByTaskId(id)
            await useCommentStore().deleteByTaskId(id)
            await useChecklistStore().deleteByTaskId(id)
            if (this.currentTask.id === id) {
                if (!this.selectFirst()) {
                    this.setCurrentTask(new Task())
                }
            }
        },
        async loadTasks(taskIds: Array<string>) {
            console.log('loadTasks:', taskIds)
            // 加载任务
            let _this = this
            await db.tasks.where('id').anyOf(taskIds).sortBy("orderNo,createDate").then((res) => {
                _this.tasks = res
                if (res.length > 0) {
                    _this.setCurrentTask(res[0])
                }
            })
        },
        async loadAllTasks() {
            // 加载任务
            let _this = this
            await db.tasks.toArray().then((res) => {
                _this.tasks = res
                if (res.length > 0) {
                    _this.setCurrentTask(res[0])
                }
            })
        },
        async loadTodayTasks() {
            // 加载任务
            let _this = this
            await db.tasks.where('dueDate').belowOrEqual(dayjs().format('YYYY-MM-dd 00:00:000')).toArray().then((res) => {
                _this.tasks = res
                if (res.length > 0) {
                    _this.setCurrentTask(res[0])
                }
            })
        },
        selectFirst() {
            console.log('selectFirst')
            if (this.tasks.length > 0) {
                this.setCurrentTask(this.tasks[0])
                return true
            }
            return false
        },
        /**
         * 用于初始化当前的选中的task
         * @param task
         */
        setCurrentTask(task: Task) {
            console.log('setCurrentTask:', typeof task)
            const commentStore = useCommentStore()
            const checklistStore = useChecklistStore()
            const linkStore = useLinkStore()
            commentStore.$reset()
            checklistStore.$reset()
            linkStore.$reset()

            this.currentTask = toRaw(task)
            // if (typeof task === 'object') {
            //     const newTask = new Task()
            //     for (let key in newTask) {
            //         // @ts-ignore
            //         newTask[key] = task[key]
            //     }
            //     this.currentTask = newTask
            // } else {
            //     this.currentTask = task
            // }

            if (this.currentTask.id) {
                commentStore.setTaskId(this.currentTask.id)
                checklistStore.setTaskId(this.currentTask.id)
                linkStore.setTaskId(this.currentTask.id)
                commentStore.load()
                checklistStore.load()
                linkStore.load()
            }
        }
    },
})