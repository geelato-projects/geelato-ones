import {BaseEntity} from "../../common/entity/BaseEntity";

export class Checklist extends BaseEntity {
    // 10：未完成 11：已完成
    statusId: string = '10'
    content: string = ''
    taskId: string = ''
}