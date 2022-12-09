import {BaseEntity} from "../../common/entity/BaseEntity";

export default class List extends BaseEntity {

    // 清单标准
    title: String = ''

    // 清单颜色
    color: String = '#FFC397'

    // 排序号
    orderNo: number = 0

    setColor(color: String) {
        this.color = color
        return this
    }
}