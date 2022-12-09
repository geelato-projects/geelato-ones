import {defineStore, SubscriptionCallbackMutation} from "pinia";
import {Task} from "../entity/Task";
import {computed, ref, toRaw, unref} from "vue";
import {useTaskStore} from "./useTaskStore";
import {db} from "../../common/store/Db";
import {useObservable} from "@vueuse/rxjs";
import {liveQuery, Table} from "dexie";
import List from "../entity/List";
import utils from "../../common/utils/Utils";
import {ListTaskMap} from "../entity/ListTaskMap";
import {useCommentStore} from "./useCommentStore";
import {Comment} from "../entity/Comment";
import {useLinkStore} from "./useLinkStore";
import {Link} from "../entity/Link";
import {useChecklistStore} from "./useCheckListStore";
import {Checklist} from "../entity/Checklist";
import {App} from "../../desktop/entity/App";
import {DaylyLog} from "../entity/DaylyLog";

export const useTodoStore = defineStore('Todo', () => {

    const taskStore = useTaskStore()
    const commentStore = useCommentStore()
    const linkStore = useLinkStore()
    const checklistStore = useChecklistStore()
    // @ts-ignore
    const lists: Array<List> = useObservable<List[]>(liveQuery(() => db.lists.orderBy('orderNo').toArray()))
    const currentList = ref(new List())
    const ListTypes = {
        STAR: 'STAR',
        ALL: 'ALL',
        // 今天事项
        TODAY: 'TODAY',
        // 日志记录
        DAYLYLOG: 'DAYLYLOG',
        NORMAL: 'NORMAL'
    }
    // starList、allList、todayList、normalList
    const currentListType = ref(ListTypes.NORMAL)
    const setCurrentListType = (listType: string) => {
        currentListType.value = listType
    }
    // 特殊列表-收藏,startList.id是个固定值
    const starList = new List()
    starList.id = ListTypes.STAR
    starList.title = '收藏事项'
    const starTasks = ref(new Array<Task>())

    // 特殊列表-今天,todayTasks.id是个固定值
    const todayList = new List()
    todayList.id = ListTypes.TODAY
    todayList.title = '今天事项'
    const todayTasks = ref(new Array<Task>())

    // 特殊列表-全部,allList.id是个固定值
    const allList = new List()
    allList.id = ListTypes.ALL
    allList.title = '全部事项'
    const allTasks = ref(new Array<Task>())

    // 特殊列表-日志记录
    const daylyLogList = new List()
    daylyLogList.id = ListTypes.DAYLYLOG
    daylyLogList.title = '日志记录'
    const currentDaylyLog = ref(new DaylyLog())
    const daylyLogs = ref(new Array<DaylyLog>())

    const tasks = computed(() => {
        return taskStore.tasks
    })

    const unfinishedTasks = computed(() => {
        return taskStore.tasks.filter((task) => {
            return task.statusId !== 'finished'
        })
    })

    const finishedTasks = computed(() => {
        return taskStore.tasks.filter((task) => {
            return task.statusId === 'finished'
        })
    })

    const currentTask = computed(() => {
        return taskStore.currentTask
    })


    // 在组件被卸载后，该订阅依旧会被保留。
    taskStore.$subscribe((mutation, state) => {
        isValidUpdate(mutation, taskStore.currentTask.id) ? taskStore.updateTask(toRaw(taskStore.currentTask)) : null
    }, {detached: true})

    commentStore.$subscribe((mutation, state) => {
        isValidUpdate(mutation, commentStore.current.id) ? commentStore.update(toRaw(commentStore.current)) : null
    }, {detached: true})

    checklistStore.$subscribe((mutation, state) => {
        isValidUpdate(mutation, checklistStore.current.id) ? checklistStore.update(toRaw(checklistStore.current)) : null
    }, {detached: true})

    linkStore.$subscribe((mutation, state) => {
        isValidUpdate(mutation, linkStore.current.id) ? linkStore.update(toRaw(linkStore.current)) : null
    }, {detached: true})

    /**
     * 有效的变更，才做相应的实体信息更新
     * @param mutation
     * @param id
     */
    const isValidUpdate = (mutation: object, id: string) => {
        if (id) {
            // @ts-ignore
            if (mutation.events?.newValue?.id === mutation.events?.oldValue?.id) {
                // @ts-ignore
                if (!utils.isEquals(mutation.events?.newValue, mutation.events?.oldValue)) {
                    return true
                }
            }
        }
        return false
    }

    const addList = async (list: List) => {
        list.id = utils.uuid(16)
        await db.lists.orderBy('orderNo').first().then((firstList) => {
            if (firstList) {
                list.orderNo = firstList.orderNo - 1
            }
            currentList.value = list
            // @ts-ignore
            lists.value.splice(0, 0, list)
            taskStore.$reset()
            db.lists.add(list)
        })
        return list
    }

    const updateList = (list: List) => {
        db.lists.put(list)
    }

    /**
     * @param lists 是raw对象，不能是proxy，或ref的对象，否则put时会出现Error: Failed to execute 'put' on 'IDBObjectStore': #<Object> could not be cloned.
     */
    const updateLists = (lists: Array<List>) => {
        // console.log('updateLists', lists)
        lists?.forEach((list, index) => {
            list.orderNo = index + 1000
            // console.log('index', index, list.orderNo)
        })
        db.lists.bulkPut(lists)
        // console.log('updateLists end', lists)
    }

    const deleteList = (id: string) => {
        console.log('deleteList:', id)
        db.lists.delete(id)
    }

    const getRawTask = (task: Task) => {
        console.log('getRawTask:', task)
        let newTask: Task;
        if (typeof task === 'object') {
            newTask = new Task()
            for (let key in newTask) {
                // @ts-ignore
                newTask[key] = task[key]
            }
        } else {
            return task
        }
        return newTask
    }

    const addTaskToStarList = (task: Task) => {
        console.log('addTaskToStarList', task, starTasks)
        // 不重复添加 TODO:改成从listTaskMap中查询检查
        const foundTask = starTasks.value.find((item) => {
            return item.id === task.id
        })
        if (foundTask) {
            return
        }
        task.star = 1
        // const rawTask = toRaw(task)
        const listTaskMap: ListTaskMap = new ListTaskMap()
        listTaskMap.taskId = task.id
        listTaskMap.listId = starList.id
        listTaskMap.id = utils.uuid(16)
        db.listTaskMap.add(listTaskMap).then(() => {
            const rawTask = toRaw(task)
            starTasks.value.push(rawTask)
            taskStore.updateTask(rawTask)
        })

    }
    const removeTaskFromStarList = (task: Task) => {
        task.star = 0

        db.listTaskMap.where({taskId: task.id, listId: starList.id}).delete().then((res) => {
            for (let index = starTasks.value.length; index > 0; index--) {
                const starTask = starTasks.value[index - 1]
                if (starTask.id === task.id) {
                    taskStore.updateTask(toRaw(task))
                    starTasks.value.splice(index - 1, 1)
                }
            }
        })
    }

    const addTaskToTodayList = (task: Task) => {
        console.log('addTaskToTodayList', task, todayTasks)
        // 不重复添加 TODO:改成从listTaskMap中查询检查
        const foundTask = todayTasks.value.find((item) => {
            return item.id === task.id
        })
        if (foundTask) {
            return
        }
        task.today = 1
        // const rawTask = toRaw(task)
        const listTaskMap: ListTaskMap = new ListTaskMap()
        listTaskMap.taskId = task.id
        listTaskMap.listId = todayList.id
        listTaskMap.id = utils.uuid(16)
        db.listTaskMap.add(listTaskMap).then(() => {
            const rawTask = toRaw(task)
            todayTasks.value.push(rawTask)
            taskStore.updateTask(rawTask)
        })
    }
    const removeTaskFromTodayList = (task: Task) => {
        task.today = 0

        db.listTaskMap.where({taskId: task.id, listId: todayList.id}).delete().then((res) => {
            for (let index = todayTasks.value.length; index > 0; index--) {
                const todayTask = todayTasks.value[index - 1]
                if (todayTask.id === task.id) {
                    taskStore.updateTask(toRaw(task))
                    todayTasks.value.splice(index - 1, 1)
                }
            }
        })
    }

    const refreshCurrentList = () => {
        return setCurrentList(currentList.value, currentListType.value)
    }
    const setCurrentList = async (list: List, listType: string) => {
        currentListType.value = listType
        currentList.value = list
        taskStore.$reset()
        taskStore.setListId(list.id)
        // 加载当前列表中的任务
        switch (listType) {
            // case ListTypes.TODAY:
            //     await taskStore.loadTodayTasks()
            //     taskStore.tasks ? todayTasks.value = taskStore.tasks : null
            //     break
            case ListTypes.ALL:
                await taskStore.loadAllTasks()
                taskStore.tasks ? allTasks.value = taskStore.tasks : null
                break
            default:
                const taskIds: Array<string> = []
                await db.listTaskMap.where("listId").equals(list.id).toArray().then((res) => {
                    res.forEach(item => {
                        taskIds.push(item.taskId)
                    })
                })
                await taskStore.loadTasks(taskIds)
                if (listType === ListTypes.STAR) {
                    taskStore.tasks ? starTasks.value = taskStore.tasks : null
                } else if (listType === ListTypes.TODAY) {
                    taskStore.tasks ? todayTasks.value = taskStore.tasks : null
                }
                break
        }
    }

    /**
     *  一般在初始化时，需要加载
     */
    const loadStarTasks = async () => {
        await db.listTaskMap.where('listId').equals(starList.id).toArray().then(async (res) => {
            console.log('loadStarTasks:', res)
            const taskIds: Array<string> = []
            if (res && res.length > 0) {
                // starTasks.value = res
                res.forEach((listTaskMap) => {
                    taskIds.push(listTaskMap.taskId)
                })
                await db.tasks.where('id').anyOf(taskIds).toArray().then((items) => {
                    starTasks.value = items
                })
            }
        })
    }

    const loadTodayTasks = async () => {
        await db.listTaskMap.where('listId').equals(todayList.id).toArray().then(async (res) => {
            console.log('loadTodayTasks:', res)
            const taskIds: Array<string> = []
            if (res && res.length > 0) {
                res.forEach((listTaskMap) => {
                    taskIds.push(listTaskMap.taskId)
                })
                await db.tasks.where('id').anyOf(taskIds).toArray().then((items) => {
                    todayTasks.value = items
                })
            }
        })
    }

    interface LooseObject {
        [key: string]: any
    }

    /**
     *  导出所有的数据
     */
    const exportData = async () => {
        const tables = ['lists', 'tasks', 'listTaskMap', 'comments', 'links', 'checklists', 'apps']
        const database: LooseObject = {}
        for (let key in tables) {
            const tableName = tables[key]
            // @ts-ignore
            database[tableName] = await db[tableName].toArray()
        }
        return database
    }

    const saveDaylyLog = (daylyLog: DaylyLog) => {
        console.log('addDaylyLog:', daylyLog)
        // daylyLog.dayStr = utils.getNowString('YYYY-MM-DD')
        if(!daylyLog.id){
            daylyLog.setCreateInfo()
        }else{
            daylyLog.updateDate = utils.getNowString('YYYY-MM-DD')
        }
        return db.daylyLogs.put(daylyLog)
    }
    /**
     * 加载指定日期的日志，默认为当天
     * @param dayStr YYYY-MM-DD
     */
    const loadDaylyLog = async (dayStr?:string) => {
        console.log('loadDaylyLog > dayStr:', dayStr)
        const defaultDayStr = utils.getNowString('YYYY-MM-DD')

        await db.daylyLogs.where('dayStr').equals(dayStr||defaultDayStr).toArray().then( (res) => {
            console.log('loadDaylyLog > res:', res)
            if (res && res.length > 0) {
                currentDaylyLog.value = toRaw(res[0])
            }
        })
    }

    /**
     * 加载所有日期的日志
     */
    const loadDaylyLogs = async () => {
        // console.log('loadDaylyLogs')
        await db.daylyLogs.toArray().then((res) => {
            console.log('loadDaylyLogs > res:',res)
            daylyLogs.value = res
        })
    }

    // 初始化
    loadStarTasks()
    loadTodayTasks()
    loadDaylyLog()
    loadDaylyLogs()

    return {

        ListTypes,
        currentListType,
        setCurrentListType,
        lists,
        starList,
        allList,
        todayList,
        currentList,
        setCurrentList,
        refreshCurrentList,
        addList,
        updateList,
        updateLists,
        deleteList,

        tasks,
        starTasks,
        loadStarTasks,
        unfinishedTasks,
        finishedTasks,
        currentTask,
        addTaskToStarList,
        removeTaskFromStarList,
        todayTasks,
        addTaskToTodayList,
        removeTaskFromTodayList,

        taskStore,
        commentStore,
        linkStore,
        checklistStore,

        daylyLogs,
        daylyLogList,
        currentDaylyLog,
        saveDaylyLog,
        loadDaylyLog,

        exportData,
    }
})
