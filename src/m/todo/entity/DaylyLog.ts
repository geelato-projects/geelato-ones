import {BaseEntity} from "../../common/entity/BaseEntity";
import dayjs from "dayjs";

export class DaylyLog extends BaseEntity {
    dayStr:string = dayjs().format('YYYY-MM-DD')
    content?: string = ''
}