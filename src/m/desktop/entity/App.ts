import {BaseEntity} from "../../common/entity/BaseEntity";

export class App extends BaseEntity {
    // 应用名称
    name: string = ''
    // icon图标集中的图标名称，iconName优先，若有值，若iconSrc无效
    iconName: string = ''
    // 应用图标 base64
    iconSrc: string = ''
    // 应用图标颜色
    color: string = ''
    // 首页地址
    index: string = ''
    // 应用打开目标
    target: string = '_blank'

    description?: string = ''
}