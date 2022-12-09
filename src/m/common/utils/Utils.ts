import dayjs from "dayjs";

class Utils {

    uuid(len: number, radix?: number) {
        // let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
        let chars = '123456789'.split('')
        let uuid = []
        let i
        radix = radix || chars.length

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
        } else {
            // rfc4122, version 4 form
            let r
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
            uuid[14] = '4'

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
                }
            }
        }
        return uuid.join('')
    }

    /**
     * 判断此对象是否是Object类型
     * @param {Object} obj
     */
    isObject(obj: any) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    };

    /**
     * 判断此类型是否是Array类型
     * @param {Array} arr
     */
    isArray(arr: any) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    };

    /**
     *  深度比较两个对象是否相同
     * @param {Object} oldData
     * @param {Object} newData
     */
    isEquals(oldData: any, newData: any) {
        //  类型为基本类型时,如果相同,则返回true
        if (oldData === newData) return true;
        if (this.isObject(oldData) && this.isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
            // 类型为对象并且元素个数相同

            // 遍历所有对象中所有属性,判断元素是否相同
            for (const key in oldData) {
                if (oldData.hasOwnProperty(key)) {
                    if (!this.isEquals(oldData[key], newData[key]))
                        // 对象中具有不相同属性 返回false
                        return false;
                }
            }
        } else if (this.isArray(oldData) && this.isArray(oldData) && oldData.length === newData.length) {
            // 类型为数组并且数组长度相同

            for (let i = 0, length = oldData.length; i < length; i++) {
                if (!this.isEquals(oldData[i], newData[i]))
                    // 如果数组元素中具有不相同元素,返回false
                    return false;
            }
        } else {
            // 其它类型,均返回false
            return false;
        }

        // 走到这里,说明数组或者对象中所有元素都相同,返回true
        return true;
    };

    downloadFile(content:string, fileName:string) {
        // 创建下载链接
        let ele = document.createElement('a');
        //设置下载的名称
        ele.download = fileName;
        // 隐藏的可下载链接
        ele.style.display = 'none';
        // 字符内容转变成blob地址
        let blob = new Blob([content]);
        ele.href = URL.createObjectURL(blob);
        // 绑定点击时间
        document.body.appendChild(ele);
        ele.click();
        // 然后移除
        document.body.removeChild(ele);
    };

    /**
     * @format 默认为'YYYY-MM-DD HH:mm:ss'
     */
    getNowString(format?:string){
        return dayjs().format(format||'YYYY-MM-DD HH:mm:ss')
    }
}

const utils = new Utils()

export default utils