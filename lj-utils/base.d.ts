/**
 * @module index
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 公共函数，使用'lj-utils'引入
 */
import { Info, AnyObject, Bool } from './types';
/**
 * @function
 * @description 获取当前网络状态（H5）
 * @return boolean
 * @returns {boolean}
 * @example
 * ```
 * const status = getNetworkStatus();
 * ```
 */
export declare const getNetworkStatus: () => boolean;
/**
 * @function
 * @description 正则收集
 * @returns {object}
 * @returns {object}
 * @example
 * ```
 * const regex = getRegexp();
 * ```
 */
export declare const getRegexp: () => AnyObject;
/**
 * @function
 * @description 设置标题
 * @param  {string} argTitle 标题
 */
export declare const setTitle: (argTitle: string | number) => void;
/**
 * @function
 * @description 使用postcss-px2rem时使用
 * @param {number} argBaseSize 基础大小 16px（要跟配置一致）
 * @param {number} argWidth 基准宽度
 */
export declare const remInit: (argBaseSize?: number, argWidth?: number) => void;
/**
 * @function
 * @description 获取cookie
 * @param  {string} argName 要获取的值
 * @returns {string}
 */
export declare const getCookie: (argName: string) => string;
/**
 * @function
 * @description 获取cookie对象
 * @returns {object}
 */
export declare const getCookieObj: () => {
    [key: string]: string;
};
/**
 * @function
 * @description 设置cookie
 * @param  {string} argName 要设置的key
 * @param  {string} argValue 要设置的value
 * @param  {number} argTime 过期时间/时 默认24
 * @param  {number} argPath path
 * @param  {number} domain domain
 */
export declare const setCookie: (argName: string, argValue?: string | number | boolean, argTime?: number, argPath?: string, domain?: string) => void;
/**
 * @function
 * @description 清除cookie
 * @param  {string} argName 要清除的值
 */
export declare const delCookie: (argName?: string) => void;
/**
 * @function
 * @description 检测浏览器状态，系统状态 *
 * @returns {Info} {
 * ua: ua,
 * platform: 平台,
 * isMobile: 移动端,
 * isWin: winPC端,
 * isIphone: iphone,
 * isIpad: ipad,
 * isMac: mac,
 * isAppleMobile: 苹果移动端webview
 * isSafari: Safari浏览器,
 * isIos: Ios平台,
 * isAndroid: android平台,
 * isIE: 显示8 9 10, true为11以上
 * ...
 * }
 */
export declare const getInfo: () => Info;
/**
 * @function
 * @description 获取随机颜色
 * @return string
 */
export declare const getRandomColor: () => string;
/**
 * @function
 * @description 获取storage的值，默认将json转为obj
 * @param {string} argKey 要获取的key
 * @param {string} argNoJson true时不自动转换JSON字符串
 * @returns {any} key对应的数据
 */
export declare const getStorage: (argKey: string, argNoJson?: string) => any;
/**
 * @function
 * @description 设置storage的值，默认将obj转为json
 * @param {string} argKey 要获取的key
 * @param {unknown} argData 要保存的数据
 * @returns {string} 保存的数据String
 */
export declare const setStorage: (argKey: string, argData: unknown) => string;
/**
 * @function
 * @description setTimeout promise版，异步阻塞函数
 * @param  {number} ms 时间，毫秒
 */
export declare const sleep: (ms: number) => Promise<unknown>;
/**
 * @description 同步阻塞函数。
 * @param {number} time - 延迟的时间量，单位为毫秒
 */
export declare const delay: (time?: number) => void;
type KeyOf<T extends Record<string, any>, K = keyof T> = K extends string ? T[K] extends Function ? never : K : never;
type DotField<T extends Record<string, any>, K = KeyOf<T>> = K extends string ? K | `${K}.${DotField<T[K]>}` : never;
type ValueOf<T extends Record<string, any>, K> = K extends `${infer I}.${infer R}` ? ValueOf<T[I], R> : K extends string ? T[K] : never;
/**
 * @function
 * @description 数据安全访问
 * @param  {any} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {any} argValue [如果数据有误，返回的值，选填]
 * @param  {boolean|0|1} argSetValueForce [是否强制赋值argValue]
 * @returns {any}
 */
export declare const safe: <T extends Record<string, any>, K extends DotField<T, KeyOf<T, keyof T>>>(argData: T, argCheck: K, argValue?: ValueOf<T, K> | undefined, argSetValueForce?: Bool) => string | ValueOf<T, K> | undefined;
/**
 * @function
 * @description 数据安全访问
 * @param  {any} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {any} argValue [如果数据有误，返回的值，选填]
 * @param  {boolean|0|1} argSetValueForce [是否强制赋值argValue]
 * @returns {any}
 */
export declare const safeData: (argData: any, argCheck: string, argValue?: any, argSetValueForce?: Bool) => any;
/**
 * @description obj转url参数
 * @function
 * @param {any} argParams 参数对象
 * @param {boolean?} noMark 默认带?,true时,不带
 * @returns {string}
 */
export declare const setUrlParams: (argParams: any, noMark?: boolean) => string;
/**
 * @description 获取url参数
 * @function
 * @param {string} argName 要获取的key
 * @param {string} argUrl url数据
 * @returns {string}
 */
export declare const getUrlParam: (argName: string, argUrl?: string) => string;
/**
 * @description 获取所有url参数，eg: a=1&b=2 to {a:1,b:2}
 * @function
 * @param {string} argData 要处理的数据
 * @returns {any}
 */
export declare const getUrlParamObj: (argData?: string) => AnyObject;
/**
 * @description 通过正则匹配修改当前页面的url中的参数
 * @function
 * @param  {string} name key
 * @param  {string | number| undefined | null} value 要替换的value
 * @param  {string} url 要替换的网址,默认location.href
 * @returns {string}
 */
export declare const replaceUrlParam: (name: string, value: string | number | undefined | null, url?: string) => string;
/**
 * @function
 * @description 获取简单uuid
 * @returns {string} uuid
 */
export declare const getUuid: () => string;
/**
 * @function
 * @description 获取随机数,含最大值，含最小值
 * @param  {number} min 最小值
 * @param  {number} max 最大值
 * @returns {number}
 */
export declare const randomInt: (min?: number, max?: number) => number;
/**
 * @function
 * @description 设置env参数，一般在main.js中调用
 * @param  {AnyObject} env 要设置的值
 */
export declare const setEnv: (env: AnyObject) => void;
/**
 * @function
 * @description 获取env参数
 * @param  {string} key 要获取的值
 * @returns {string} 获取的值
 */
export declare const getEnv: (key: string) => string;
/**
 * @function
 * @description 设置object参数,可做运行时缓存
 * @param  {string} key 要设置的key
 * @param  {AnyObject} data 要设置的值
 * @returns {AnyObject}
 */
export declare const setObj: (key: string, data: AnyObject) => AnyObject;
/**
 * @function
 * @description 获取object参数
 * @param  {string} key 要获取的值
 * @param  {string} argData 要合并的值
 * @param  {boolean} isDeepCopy 是否深拷贝
 * @returns {AnyObject} 获取的值
 */
export declare const getObj: (key: string, argData?: AnyObject, isDeepCopy?: Bool) => AnyObject;
/**
 * @function
 * @description 设置日志输出logLevel 1 error 2 warn 3 info 4 log 5 debug
 * @param {AnyObject} logConfig 重写配置
 * @param {function} logConfig.error 错误日志回调（做额外处理用）
 * @example
 * setLog(localStorage.getItem('logLevel'),{
   error: (...arg) => {
     // todo
   }
 })
 */
export declare const setLog: (logLevel?: string | number, logConfig?: AnyObject) => void;
/**
 * @function
 * @description深拷贝函数
 * @param obj 需要拷贝的对象
 * @returns 拷贝后的对象
 */
export declare const deepCopy: (obj: any, hash?: WeakMap<object, any>) => any;
/**
 * @function
 * @description 摇一摇，请求使用 DeviceMotionEvent API 的权限。for ios
 * @returns Promise，指示是否已授予权限。
 * @example
 * ```
 * const hasRequest = await requestDeviceMotionPermission()
 * if (hasRequest) {
 *    useEventListener(window, 'devicemotion', handleShake)
 *  } else {
 *    showToast('未授权访问运动传感器,请手动点击！')
 *  }
 * ```
 */
export declare const requestDeviceMotionPermission: () => any;
/**
 * @function
 * @description 自动播放音频并返回音频元素。
 * @param {string} audioUrl - 音频地址
 * @param {boolean} isWeixin - 是否在微信中
 * @returns {HTMLAudioElement} - 音频元素
 */
export declare const autoPlayAudio: (audioUrl: string, isWeixin: boolean) => HTMLAudioElement;
/**
 * @desc Debounce function to limit the rate of function calls.
 * @param {Function} func - The function to be debounced
 * @param {number} delay - The delay in milliseconds
 * @return {Function} The debounced function
 * @example
 * ```
 * const debouncedHello = debounce(sayHello, 1000);
 * debouncedHello('Hello from 1');
 * debouncedHello('Hello from 2');
 * ```
 */
export declare const debounce: (func: Function, delay: number) => (...args: any[]) => void;
/**
 * @function
 * @description 添加事件绑定
 * @param {Element} el - 绑定元素
 * @param {string} event - 事件名称
 * @param {function} handler - 事件处理函数
 */
export declare const on: (el: any, event: string, handler: any) => void;
/**
 * @function
 * @description 移除事件绑定
 * @param {Element} el - 绑定元素
 * @param {string} event - 事件名称
 * @param {function} handler - 事件处理函数
 */
export declare const off: (el: any, event: string, handler: any) => void;
export {};
