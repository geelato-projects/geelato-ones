import dayjs from "dayjs";
import utils from "../utils/Utils";

export class BaseEntity {
    id: string = ''
    creatorName: string = ''
    creatorId: string = ''
    createDate: string = ''
    updaterName: String = ''
    updaterId: string = ''
    updateDate: string = ''

    setUpdateInfo() {
        this.updateDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    setCreateInfo() {
        this.id = utils.uuid(16)
        this.createDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

}