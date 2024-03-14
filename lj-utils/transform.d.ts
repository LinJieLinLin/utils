import { AnyObject } from './types';
/**
 * @function
 * @description 转义html标签
 * @param  {string} argHtml 需要转义的文本
 * @returns {string}
 * @example
 * // returns '&lt;p&gt;Hello, World!&lt;/p&gt;'
 * encodeHtml('<p>Hello, World!</p>')
 */
export declare const encodeHtml: (argHtml: string) => string;
/**
 * @function decodeHtml
 * @description 反转义HTML标签。
 * @param {string} argHtml - 需要反转义的文本。
 * @returns {string} 反转义后的文本。
 * @example
 * // 返回 "&lt;p&gt;Hello, World!&lt;/p&gt;"
 * decodeHtml("<p>Hello, World!</p>");
 */
export declare const decodeHtml: (argHtml: string) => string;
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
export declare const rmbPrice: (argData: unknown, argRate?: number, argUnit?: string, argDef?: string) => string;
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
export declare const formatTime: (date?: string | number | Date, fmt?: string, emptyTip?: string) => string;
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
export declare const friendlyTime: (date?: string | number | Date, fmt?: string, emptyTip?: string) => string;
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
export declare const px2vw: (argPx: number, argWith?: number, argUnit?: string, argNum?: number) => string;
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
export declare const secondToTime: (argData: number, argOption?: {
    s?: string;
    m?: string;
    h?: string;
    d?: string;
    M?: string;
    y?: string;
    maxUnit?: string;
    minUnit?: string;
    hideZero?: boolean;
    isAddZero?: boolean;
}) => string;
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
export declare const formatSize: (argData: number, argNum?: number, argIndex?: number, argRate?: number, unit?: string[]) => string;
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
export declare const formatNumber: (argData: number, argNum?: number) => string;
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
export declare const hideInfo: (argData?: string | number, argStart?: number, argEnd?: number) => string;
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
export declare const string10to62: (argData: number | string) => string;
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
export declare const string62to10: (argData: string) => number;
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
export declare const toFixed: (argData: string | number, argNum?: number, argType?: 'round' | 'floor' | 'ceil' | 'abs') => string;
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
export declare const toLine: (argData: string, argUnit?: string) => string;
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
export declare const toHump: (argData: string, argUnit?: string) => string;
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
export declare const arrayToObj: (list: any[], key?: string, extraData?: string | object) => AnyObject;
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
export declare const objToArray: (obj: {
    [key: string]: any;
}, key?: string, value?: string, isReverse?: boolean) => any[];
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
export declare const objToObj: (obj: {
    [key: string]: any;
}, tmplObj: {
    [key: string]: any;
}, isAssign?: boolean) => object;
