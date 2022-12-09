import {BaseEntity} from "../../common/entity/BaseEntity";
import {Comment} from "./Comment";
import {Tag} from "./Tag";

export class Task extends BaseEntity {

    // 所属项目ID
    projectId: string = ''

    // 任务标题 content
    title: string = ''

    // 任务状态 WWC:未完成、YWC已完成
    statusId: string = 'unfinished'

    // 任务描述、任务备注
    description: string = ''

    // 任务执行者名称
    executor: string = ''

    // 任务执行者id
    executorId: string = ''

    // 任务优先级
    priority: number = 1

    // 父任务id
    parentId: string = ''

    // 开始日期
    startDate: string = ''

    // 截止日期
    dueDate: string = ''

    // 任务的可见性规则 involves | members
    visible: string = ''

    // @不需持久化
    // 收藏的任务 1|0
    star:number = 0

    // @不需持久化
    // 今天跟进的任务 1|0
    today:number = 0

}