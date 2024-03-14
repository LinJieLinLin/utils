import { safeData, deepCopy } from './base.js';

/**
 * @module index
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 类型转换相关处理
 */
/**
 * @function
 * @description 转义html标签
 * @param  {string} argHtml 需要转义的文本
 * @returns {string}
 * @example
 * // returns '&lt;p&gt;Hello, World!&lt;/p&gt;'
 * encodeHtml('<p>Hello, World!</p>')
 */
const encodeHtml = (argHtml) => {
    if (!argHtml || argHtml.length === 0) {
        return '';
    }
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&apos;',
        '"': '&quot;',
        ' ': '&nbsp;',
        '\n': '<br>',
    };
    return argHtml.replace(/[&<>"' \n]/g, function (char) {
        return htmlEntities[char];
    });
};
/**
 * @function decodeHtml
 * @description 反转义HTML标签。
 * @param {string} argHtml - 需要反转义的文本。
 * @returns {string} 反转义后的文本。
 * @example
 * // 返回 "&lt;p&gt;Hello, World!&lt;/p&gt;"
 * decodeHtml("<p>Hello, World!</p>");
 */
const decodeHtml = (argHtml) => {
    const htmlEntities = {
        quot: '"',
        apos: "'",
        lt: '<',
        gt: '>',
        nbsp: ' ',
        amp: '&',
    };
    return argHtml.replace(/&([^;]+);/g, (match, entity) => {
        return htmlEntities[entity] || match;
    });
};
/**
 * @function rmbPrice
 * @description 显示人民币价格。
 * @param {unknown} argData - 价格。
 * @param {number} argRate - 保留多少位小数，默认为-1。
 * @param {string} argUnit - 单位，默认为'￥'。
 * @param {string} argDef - 空数据默认值，默认为'--'。
 * @returns {string} 格式化后的价格字符串，例如：'￥100'。
 * @example
 * // 返回 '￥100.00'
 * rmbPrice(100, 2);
 */
const rmbPrice = (argData, argRate = -1, argUnit = '￥', argDef = '--') => {
    if (typeof argData === 'string' || typeof argData === 'number') {
        if (!argData && argData !== 0) {
            return argDef;
        }
    }
    else {
        return argDef;
    }
    argData = Number(argData);
    if (argRate > -1) {
        argData = +toFixed(argData, argRate);
    }
    return argUnit + argData;
};
/**
 * @function formatTime
 * @description 日期格式化显示。
 * @param {string|number|Date} date - 时间对象或时间戳，默认为当前时间。
 * @param {string} fmt - 格式化字符串，默认为'YYYY-MM-DD HH:mm:ss'。E为星期数，EEE:星期一，q为季度，S为毫秒数。
 * @param {string} emptyTip - 当date为false时的默认值，默认为''。
 * @returns {string} 格式化后的日期字符串。
 * @example
 * // 返回 '2022-01-01 00:00:00'
 * formatTime(new Date(2022, 0, 1));
 */
const formatTime = (date = +new Date(), fmt = 'YYYY-MM-DD HH:mm:ss', emptyTip = '') => {
    if (!date && date !== 0) {
        return emptyTip;
    }
    if (isNaN(+date)) {
        return emptyTip;
    }
    if (typeof date === 'number') {
        if (date.toString().length === 10) {
            date = date * 1000;
        }
    }
    date = new Date(+date);
    const fmtMap = {
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
    };
    const week = {
        0: '\u65e5',
        1: '\u4e00',
        2: '\u4e8c',
        3: '\u4e09',
        4: '\u56db',
        5: '\u4e94',
        6: '\u516d',
    };
    const temY = fmt.match(/(Y+)/);
    if (temY) {
        fmt = fmt.replace(temY[0], (date.getFullYear() + '').substring(4 - temY[0].length));
    }
    const temWeek = fmt.match(/(E+)/);
    if (temWeek) {
        const temWeekName = ['', '\u5468'];
        fmt = fmt.replace(temWeek[0], (temWeekName[temWeek[0].length] || '\u661f\u671f') +
            safeData(week, date.getDay().toString(), ''));
    }
    for (let k in fmtMap) {
        let temMatch = fmt.match(new RegExp('(' + k + ')'));
        if (temMatch) {
            fmt = fmt.replace(temMatch[0], temMatch[0].length === 1
                ? fmtMap[k].toString()
                : ('00' + fmtMap[k].toString()).substring(('' + fmtMap[k]).length));
        }
    }
    return fmt;
};
/**
 * @function friendlyTime
 * @description 日期格式化友好显示。例如：刚刚，x分钟前，...。超过一年的按 fmt来格式化。
 * @param {string|number|Date} date - 时间对象或时间戳，默认为当前时间。
 * @param {string} fmt - 格式化字符串，默认为'YYYY-MM-DD HH:mm:ss'。
 * @param {string} emptyTip - 当date为false时的默认值，默认为''。
 * @returns {string} 格式化后的友好日期字符串。
 * @example
 * // 返回 '刚刚'
 * friendlyTime(new Date());
 */
const friendlyTime = (date = +new Date(), fmt = 'YYYY-MM-DD HH:mm:ss', emptyTip = '') => {
    if (!date && date !== 0) {
        return emptyTip;
    }
    if (isNaN(+date)) {
        return emptyTip;
    }
    if (typeof date === 'number' || typeof date === 'string') {
        if (date.toString().length === 10) {
            date = date.toString() + '000';
        }
    }
    date = new Date(+date);
    let diff = (new Date().getTime() - date.getTime()) / 1000;
    let dayDiff = Math.floor(diff / 86400);
    let isValidDate = Object.prototype.toString.call(date) === '[object Date]' &&
        !isNaN(date.getTime());
    if (!isValidDate) {
        console.warn('friendlyTime:', 'not a valid date');
        return emptyTip || '--';
    }
    if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 365) {
        return formatTime(date, fmt);
    }
    return ((dayDiff === 0 &&
        ((diff < 60 && '刚刚') ||
            (diff < 120 && '1分钟前') ||
            (diff < 3600 && Math.floor(diff / 60) + '分钟前') ||
            (diff < 7200 && '1小时前') ||
            (diff < 86400 && Math.floor(diff / 3600) + '小时前'))) ||
        (dayDiff === 1 && '昨天') ||
        (dayDiff < 7 && dayDiff + '天前') ||
        (dayDiff < 31 && Math.ceil(dayDiff / 7) + '周前') ||
        (dayDiff < 365 && Math.ceil(dayDiff / 31) + '月前')).toString();
};
/**
 * @function px2vw
 * @description 将px单位转换为vw单位
 * @param {number} argPx - px单位的数值
 * @param {number} argWith - px对应的最大宽度，默认为375
 * @param {string} argUnit - 单位，'vw'或'%'，默认为'vw'
 * @param {number} argNum - 保留的小数位数，默认为6
 * @returns {string} 转换后的数值
 * @example
 * // returns '187.5vw'
 * px2vw(200, 375, 'vw', 6)
 */
const px2vw = (argPx, argWith = 375, argUnit = 'vw', argNum = 6) => {
    return +toFixed((100 / argWith) * argPx, argNum) + argUnit;
};
/**
 * @function secondToTime
 * @description 将秒数转换为倒计时格式
 * @param {number} argData - 秒数
 * @param {Object} argOption - 配置项
 * @param {string} argOption.s - 秒的单位，默认为'秒'
 * @param {string} argOption.m - 分的单位，默认为'分'
 * @param {string} argOption.h - 时的单位，默认为'时'
 * @param {string} argOption.d - 天的单位，默认为'天'
 * @param {string} argOption.M - 月的单位，默认为'月'
 * @param {string} argOption.y - 年的单位，默认为'年'
 * @param {string} argOption.minUtil - 最小显示的时间单位，小于该单位的舍去，默认为's'
 * @param {string} argOption.maxUnit - 最大的时间单位，默认为'y'，大于该单位的合入该单位 's,m,h,d,M,y 对应 秒 分 时 天 月 年'，例如: 'm' '13月'
 * @param {boolean} argOption.hideZero - 是否隐藏为0的时间单位，默认为false，例如 01h05s
 * @param {boolean} argOption.isAddZero - 是否小于10时，是否添加0，默认为true
 * @returns {string} 转换后的倒计时格式的字符串
 * @example
 * // returns '01h05s'
 * secondToTime(3905, {s: '秒', m: '分', h: '时', d: '天', M: '月', y: '年', minUtil: 's', maxUnit: 'y', hideZero: false, isAddZero: true})
 */
const secondToTime = (argData, argOption = {}) => {
    let res = [];
    const { s = '秒', m = '分', h = '时', d = '天', M = '月', y = '年', minUnit = 's', maxUnit = 'y', isAddZero = true, } = argOption;
    const listObj = {
        s: {
            size: 1,
            type: 's',
            unit: s,
            index: 0,
        },
        m: {
            size: 60,
            unit: m,
            type: 'm',
            index: 1,
        },
        h: {
            size: 60,
            unit: h,
            type: 'h',
            index: 2,
        },
        d: {
            size: 24,
            unit: d,
            type: 'd',
            index: 3,
        },
        M: {
            size: 30,
            unit: M,
            type: 'M',
            index: 4,
        },
        y: {
            size: 12,
            unit: y,
            type: 'y',
            index: 5,
        },
    };
    let list = [listObj.s, listObj.m, listObj.h, listObj.d, listObj.M, listObj.y];
    let temLen = list.length;
    let second = argData;
    let size = 1;
    let index = 0;
    for (let i = 0; i < temLen; i++) {
        let lastSize = size;
        if (maxUnit === list[i].type) {
            let temTime = Math.floor(second / lastSize);
            if (isAddZero && temTime < 10) {
                temTime = '0' + temTime;
            }
            res.unshift(temTime);
            index = temLen - i - 1;
            break;
        }
        size = size * (list[i + 1]?.size || 0) || 1;
        let time = Math.floor((second % size) / lastSize);
        if (isAddZero && time < 10) {
            time = '0' + time;
        }
        res.unshift(time);
    }
    let timeText = '';
    let isZero = true;
    temLen = res.length;
    for (let i = 0; i < temLen; i++) {
        const v = res[i];
        if (!+v && (isZero || argOption.hideZero)) ;
        else {
            isZero = false;
            timeText += v + list[5 - (index + i)].unit;
            if (minUnit === list[5 - (index + i)].type) {
                break;
            }
        }
    }
    return timeText;
};
/**
 * @function formatSize
 * @description 将byte数据转换为容量单位
 * @param {number} argData - byte数据
 * @param {number} argNum - 保留的小数位数，默认为2
 * @param {number} argIndex - 起始单位偏移，例如: 0:b 1:k 2:m，默认为0
 * @param {number} argRate - 进制，默认为1024
 * @param {string[]} unit - 进制，默认为['B', 'K', 'M', 'G', 'T', 'P']
 * @returns {string} 计算结果
 * @example
 * // returns '1.95K'
 * formatSize(2000, 2, 0, 1024, ['B', 'K', 'M', 'G', 'T', 'P'])
 */
const formatSize = (argData, argNum = 2, argIndex = 0, argRate = 1024, unit = ['B', 'K', 'M', 'G', 'T', 'P']) => {
    let list = unit;
    if (!argData) {
        return '0' + list[argIndex];
    }
    let len = list.length;
    let nowIndex = len - 1;
    let temData = 0;
    for (let i = 0; i < len; i++) {
        temData = argData / Math.pow(argRate, i);
        if (temData < argRate) {
            nowIndex = argIndex + i;
            break;
        }
    }
    return +toFixed(temData, argNum) + list[nowIndex];
};
/**
 * @function formatNumber
 * @description 将数据转换为数量单位k/w
 * @param {number} argData - 数据
 * @param {number} argNum - 保留的小数位数，默认为2
 * @returns {string} 计算结果
 * @example
 * // returns '2k'
 * formatNumber(2000, 2)
 */
const formatNumber = (argData, argNum = 2) => {
    if (argData < 1000) {
        return argData.toString();
    }
    else if (argData < 10000) {
        return +toFixed(argData / 1000, argNum) + 'k';
    }
    else {
        return +toFixed(argData / 10000, argNum) + 'w';
    }
};
/**
 * 在数据中间添加星号。
 * @function
 * @description 数据中间加星号
 * @param {string|number} argData - 要处理的数据。
 * @param {number} argStart=3 - 前端显示多少位。
 * @param {number} argEnd=4 - 后面显示多少位。
 * @returns {string} - 返回处理好的数据。
 * @example
 * // 示例
 * const data = '1234567890';
 * const hiddenData = hideInfo(data, 3, 4);
 * console.log(hiddenData); // 输出: '123***7890'
 */
const hideInfo = (argData = '', argStart = 3, argEnd = 4) => {
    argData = String(argData);
    let temLen = argData.length;
    let temSL = argData.length - argEnd - argStart;
    let start = '';
    if (temSL > 0) {
        for (let i = 0; i < temSL; i++) {
            start += '*';
        }
        argData =
            argData.substring(0, argStart) +
                start +
                argData.substring(temLen - argEnd, temLen);
    }
    return argData;
};
/**
 * @function
 * @description 将10进制数据转换为62进制，用于短网址转换。
 * @date 2020-03-01
 * @param {number|string} argData - 要处理的数据。
 * @returns {string} - 返回处理好的数据。
 * @example
 * // 示例
 * const data = 123456;
 * const convertedData = string10to62(data);
 * console.log(convertedData); // 输出: 'w7E'
 */
const string10to62 = (argData) => {
    let chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('');
    let radix = chars.length;
    let data = +argData;
    let arr = [];
    do {
        let mod = data % radix;
        data = (data - mod) / radix;
        arr.unshift(chars[mod]);
    } while (data);
    return arr.join('');
};
/**
 * @function
 * @description 将62进制数据转换为10进制，用于短网址转换。
 * @date 2020-03-01
 * @param {string} argData - 要处理的数据。
 * @returns {number} - 返回处理好的数据。
 * @example
 * // 示例
 * const data = 'w7E';
 * const convertedData = string62to10(data);
 * console.log(convertedData); // 输出: 123456
 */
const string62to10 = (argData) => {
    let chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
    let radix = chars.length;
    let len = argData.length;
    let i = 0;
    let resNum = 0;
    while (i < len) {
        resNum +=
            Math.pow(radix, i++) * chars.indexOf(argData.charAt(len - i) || '0');
    }
    return resNum;
};
/**
 * @function
 * @description 对数据进行toFixed处理。
 * @date 2020-03-01
 * @param {string|number} argData - 要处理的数据。
 * @param {number} argNum - 要保留的位数，默认返回2位小数。
 * @param {string} argType - 返回类型，round:默认四舍五入,floor:向下取整,ceil:向上取整,abs:绝对值。
 * @returns {string} - 返回处理好的数据。
 * @example
 * // 示例
 * const data = 123.456;
 * const fixedData = toFixed(data, 2, 'round');
 * console.log(fixedData); // 输出: '123.46'
 */
const toFixed = (argData, argNum = 2, argType = 'round') => {
    if (isNaN(+argData)) {
        return '';
    }
    const data = Math[argType](+argData * Math.pow(10, argNum)) / Math.pow(10, argNum);
    return data.toFixed(argNum);
};
/**
 * @function
 * @description 将驼峰字符串转换为下划线字符串
 * @param {string} argData - 要转换的字符串。
 * @param {string} argUnit - 要转换的字符，默认为“_”。
 * @return {string} - 转换后的下划线字符串。
 * @example
 * // 示例
 * const data = 'camelCase';
 * const convertedData = toLine(data);
 * console.log(convertedData); // 输出: 'camel_case'
 */
const toLine = (argData, argUnit = '_') => {
    return argData.replace(/([A-Z])/g, argUnit + '$1').toLowerCase();
};
/**
 * @function
 * @description 将下划线字符串转换为驼峰字符串
 * @param {string} argData - 要转换的字符串。
 * @param {string} argUnit - 要转换的字符，默认为“_”。
 * @return {string} - 转换后的驼峰字符串。
 * @example
 * // 示例
 * const data = 'underscore_case';
 * const convertedData = toHump(data);
 * console.log(convertedData); // 输出: 'underscoreCase'
 */
const toHump = (argData, argUnit = '_') => {
    return argData.replace(new RegExp('\\' + argUnit + '(\\w)', 'g'), (_, letter) => {
        return letter.toUpperCase();
    });
};
/**
 * @function
 * @description 指定数组key,转换为对象
 * @param {any[]} list - 数组。
 * @param {string} key - 对象对应的键值。
 * @param {string|object} extraData - 为string时，返回对象的键值对,为object时，返回对象。
 * @return {Object} - 返回的对象。
 * @example
 * // 示例
 * const list = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * const obj = arrayToObj(list, 'id');
 * console.log(obj); // 输出: { '1': { id: 1, name: 'Alice' }, '2': { id: 2, name: 'Bob' } }
 */
const arrayToObj = (list, key = '', extraData = '') => {
    let obj = {};
    list.forEach((item, k) => {
        if (extraData) {
            if (typeof extraData === 'string') {
                obj[item[key] || key + k] = item[extraData] || '';
            }
            else if (typeof extraData === 'object') {
                obj[item[key] || key + k] = Object.assign(item, deepCopy(extraData));
            }
        }
        else {
            obj[item[key] || key + k] = item;
        }
    });
    return obj;
};
/**
 * @function
 * @description 将对象转换为键值对数组。
 * @param {object} obj - 要转换的对象。
 * @param {string} [key='key'] - 每个键值对的键名称默认key。
 * @param {string} [value='value'] - 每个键值对的值名称默认value。
 * @param {boolean} [isReverse=false] - 如果为true，则键值对将被颠倒,默认为false。
 * @return {array} - 键值对数组。
 * @example
// Example usage
const obj = { a: 1, b: 2 };
const result = objToArray(obj, 'id', 'v', true);
console.log(result); // Output: [{ v: 'a', id: 1 }, { v: 'b', id: 2 }]
*/
const objToArray = (obj, key = 'key', value = 'value', isReverse = false) => {
    const result = [];
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            result.push({
                [key]: isReverse ? obj[k] : k,
                [value]: isReverse ? k : obj[k],
            });
        }
    }
    return result;
};
/**
 * @function
 * @description 从原始对象中复制属性，并将其赋值给新对象，生成一个新对象。
 * @param {Object} obj - 要复制属性的原始对象。
 * @param {Object} tmplObj - 要赋值属性的新对象模板。
 * @param {boolean} isAssign - 可选。确定是否将属性赋值给原始对象。
 * @return {Object} 复制了属性的新对象。
 * @example
 * // 示例
 * const obj = { a: 1, b: 2 };
 * const tmplObj = { a: 0, c: 0 };
 * const newObj = objToObj(obj, tmplObj);
 * console.log(newObj); // 输出: { a: 1, c: '' }
 */
const objToObj = (obj, tmplObj, isAssign = false) => {
    let newObj = deepCopy(tmplObj);
    for (const key in newObj) {
        const temKey = String(newObj[key] || key);
        if (typeof newObj[key] === 'object') {
            newObj[key] = objToObj(obj, newObj[key]);
        }
        else {
            newObj[key] = safeData(obj, temKey, '');
        }
    }
    if (isAssign) {
        newObj = Object.assign({}, obj, newObj);
    }
    return newObj;
};

export { arrayToObj, decodeHtml, encodeHtml, formatNumber, formatSize, formatTime, friendlyTime, hideInfo, objToArray, objToObj, px2vw, rmbPrice, secondToTime, string10to62, string62to10, toFixed, toHump, toLine };
