import {BaseEntity} from "../../common/entity/BaseEntity";

export class Link extends BaseEntity {
    title: string = ''
    icon?:string = ''
    url: string = ''
    taskId: string = ''
}