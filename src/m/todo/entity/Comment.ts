import {BaseEntity} from "../../common/entity/BaseEntity";

export class Comment extends BaseEntity {
    title:string = ''
    content?: string = ''
    taskId: string = ''
}