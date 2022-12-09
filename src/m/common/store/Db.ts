import Dexie, {Table} from "dexie";
import List from "../../todo/entity/List";
import {Task} from "../../todo/entity/Task";
import {ListTaskMap} from "../../todo/entity/ListTaskMap";
import {Comment} from "../../todo/entity/Comment";
import {Link} from "../../todo/entity/Link";
import {Checklist} from "../../todo/entity/Checklist";
import {App} from "../../desktop/entity/App";
import {DaylyLog} from "../../todo/entity/DaylyLog";
// export interface List {
//     id: number;
//     orderNo: number,
//     title: string;
//     color: string;
// }



export class GeelatoTeamsDexie extends Dexie {
    lists!: Table<List>;
    tasks!: Table<Task>;
    listTaskMap!: Table<ListTaskMap>;
    comments!: Table<Comment>;
    links!: Table<Link>
    checklists!: Table<Checklist>
    apps!:Table<App>
    daylyLogs!:Table<DaylyLog>

    constructor() {
        super('GeelatoOnes');
        const defaultFields = 'creatorId,creatorName,createDate,updaterId,updaterName,updateDate'
        const tables = {
            lists: 'title, orderNo, color',
            tasks: 'title,description,statusId,projectId,executor,executorId,priority,parentId,startDate,dueDate,visible',
            listTaskMap: 'listId,taskId',
            comments: 'taskId, title, content',
            links: 'taskId, title,url,icon',
            checklists: 'statusId,taskId, content',
            apps:'iconSrc,iconName,name,index,color,description',
            daylyLogs:'content,dayStr'
        }
        for (let tablesKey in tables) {
            // @ts-ignore
            tables[tablesKey] = 'id,' + tables[tablesKey] + ',' + defaultFields
        }
        this.version(13).stores(tables);
    }
}




export const db = new GeelatoTeamsDexie();
