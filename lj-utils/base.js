import { isJson } from './is.js';

/**
 * @module index
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 公共函数，使用'lj-utils'引入
 */
let isOnline = true;
let ENV = {};
let DATA_OBJECT = {};
// 断网监听
if (globalThis && globalThis.addEventListener) {
    // #ifdef H5
    globalThis.addEventListener('offline', function () {
        console.debug('offLine');
        isOnline = false;
    });
    globalThis.addEventListener('online', function () {
        console.debug('onLine');
        isOnline = true;
    });
    // #endif
}
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
const getNetworkStatus = () => {
    return isOnline;
};
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
const getRegexp = () => {
    return {
        // 匹配html标签，提取html文字： htmlCode.replace(reg.html,'')
        html: /<[^>]+>/gim,
        // 至少1数字1字母1字符，8-16位
        password: /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[\W_]).{8,16}$/,
        // 普通身份证号正则，isIdCard更为严格
        idCard: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
        // 简易身份证号 数字+x
        idCardNormal: /^[0-9]\d+([0-9]|X|x)*$/,
        // 手机号
        phone: /^1\d{10}$/,
        // 邮箱
        email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
        // 网址
        http: /http:\/\/|https:\/\//,
        // 含0整数（得分）
        score: /^[1-9]\d*|0$/,
        // 整数
        int: /^[1-9]\d*$/,
        // 匹配数字
        number: /^\d*$/,
        // >=0||1位小数
        float1: /^(([1-9]\d*)|0|(0.\d{0,1})|([1-9]\d*.\d{0,1}))$/,
        // >=0||2位小数
        float2: /^(([1-9]\d*)|0|(0.\d{0,2})|([1-9]\d*.\d{0,2}))$/,
        // >=0||3位小数
        float3: /^(([1-9]\d*)|0|(0.\d{0,3})|([1-9]\d*.\d{0,3}))$/,
        // 字母+数字组合
        letterNumber: /^[a-zA-Z0-9]*$/,
        // 字母
        letter: /^[a-zA-Z]*$/,
        // 帐号50个字内：大小写+数字+中文+'_'+'-'
        account: /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{1,50}$/,
        // 中英文姓名 50个字内/中文 中文/英文-. 英文-./
        realName: /^([\u4e00-\u9fa5]{1,50}|[\u4e00-\u9fa5]{1,25}[\s][\u4e00-\u9fa5]{1,24}|[a-zA-Z_\-.]{1,50}|[a-zA-Z_\-.]{1,25}[\s][a-zA-Z_\-.]{1,24})$/,
        // 匹配中文
        cn: /^[\u4e00-\u9fa5]*$/,
        // 匹配ASCII,非中文之外的字符（全角字符）
        ascii: /^[\x20-\x7E]+$/,
    };
};
/**
 * @function
 * @description 设置标题
 * @param  {string} argTitle 标题
 */
const setTitle = (argTitle) => {
    if (typeof globalThis.document === 'object') {
        globalThis.document.title = String(argTitle);
    }
    if (getInfo().isAppleMobile) {
        const i = document.createElement('iframe');
        i.onload = () => {
            setTimeout(() => {
                console.debug('apple mobile setting title');
                i.remove();
            }, 10);
        };
        globalThis.document.body.appendChild(i);
    }
};
/**
 * @function
 * @description 使用postcss-px2rem时使用
 * @param {number} argBaseSize 基础大小 16px（要跟配置一致）
 * @param {number} argWidth 基准宽度
 */
const remInit = (argBaseSize = 16, argWidth = 375) => {
    // 设置 rem 函数
    const setRem = () => {
        // 当前页面宽度相对于 argWidth 宽的缩放比例，可根据自己需要修改。
        const scale = safeData(globalThis, 'document.documentElement.clientWidth', argWidth) /
            argWidth;
        // 设置页面根节点字体大小
        safeData(globalThis, 'document.documentElement.style.fontSize', argBaseSize * scale + 'px', true);
    };
    // 初始化
    setRem();
    // 改变窗口大小时重新设置 rem
    globalThis.onresize = () => {
        setRem();
    };
};
/**
 * @function
 * @description 获取cookie
 * @param  {string} argName 要获取的值
 * @returns {string}
 */
const getCookie = (argName) => {
    const cookies = globalThis.document.cookie.split('; ');
    const cookie = cookies.find((cookie) => {
        const [name] = cookie.split('=');
        return argName === name;
    });
    return cookie ? decodeURIComponent(cookie.split('=')[1] || '') : '';
};
/**
 * @function
 * @description 获取cookie对象
 * @returns {object}
 */
const getCookieObj = () => {
    const cookies = globalThis.document.cookie.split('; ');
    const cookieObj = {};
    cookies.forEach((cookie) => {
        const [key, value = ''] = cookie.split('=');
        cookieObj[key] = decodeURIComponent(value);
    });
    return cookieObj;
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
const setCookie = (argName, argValue = '', argTime = 24, argPath = '/', domain = globalThis.location.hostname) => {
    if (argTime === 0) {
        globalThis.document.cookie = `${argName}=${encodeURIComponent(argValue)};path=${argPath};domain=${domain};`;
    }
    else {
        const now = new Date();
        const offset = 8;
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const nd = utc + 3600000 * offset;
        const exp = new Date(nd);
        exp.setTime(exp.getTime() + argTime * 60 * 60 * 1000);
        globalThis.document.cookie = `${argName}=${encodeURIComponent(argValue)};path=${argPath};expires=${exp.toUTCString()};domain=${domain};`;
    }
};
/**
 * @function
 * @description 清除cookie
 * @param  {string} argName 要清除的值
 */
const delCookie = (argName = '') => {
    setCookie(argName, '', -1);
};
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
const getInfo = () => {
    let ua = safeData(globalThis, 'navigator.userAgent', '').toLowerCase();
    let platform = safeData(globalThis, 'navigator.userAgentData.platform', '').toLowerCase();
    let info = {
        ua: ua,
        platform: platform,
        isMobile: !!ua.match(/mobile/),
        isWin: !!platform.match('win'),
        isIphone: !!ua.match(/iphone/),
        isIpad: !!ua.match(/ipad/),
        isMac: !!platform.match('mac'),
        isIos: !!platform.match('ios'),
        isAndroid: !!platform.match('android'),
        isSafari: ua.indexOf('safari') > -1 && ua.indexOf('chrome') < 1,
        isIE: 'ActiveXObject' in globalThis,
        ieVersion: 0,
        isAppleMobile: false,
        isWeixin: !!ua.match(/MicroMessenger/i),
        isAlipay: !!ua.match(/Alipay/i),
    };
    if (info.ua.match('msie')) {
        let IE = info.ua.match(/msie\s([0-9]*)/);
        if (IE && IE.length >= 2) {
            info.ieVersion = +IE[1];
        }
    }
    info.isAppleMobile = !!(info.isMobile &&
        ua.toLowerCase().indexOf('applewebkit') &&
        ua.indexOf('chrome') < 1);
    return info;
};
/**
 * @function
 * @description 获取随机颜色
 * @return string
 */
const getRandomColor = function () {
    return ('#' +
        ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substring(-6));
};
/**
 * @function
 * @description 获取storage的值，默认将json转为obj
 * @param {string} argKey 要获取的key
 * @param {string} argNoJson true时不自动转换JSON字符串
 * @returns {any} key对应的数据
 */
const getStorage = (argKey, argNoJson) => {
    let res = globalThis.localStorage.getItem(argKey);
    // 默认转义JSON字符串
    if (!argNoJson && isJson(res) && res) {
        res = JSON.parse(res);
    }
    return res || '';
};
/**
 * @function
 * @description 设置storage的值，默认将obj转为json
 * @param {string} argKey 要获取的key
 * @param {unknown} argData 要保存的数据
 * @returns {string} 保存的数据String
 */
const setStorage = (argKey, argData) => {
    if (typeof argData === 'object') {
        argData = JSON.stringify(argData);
    }
    globalThis.localStorage.setItem(argKey, String(argData));
    return String(argData);
};
/**
 * @function
 * @description setTimeout promise版，异步阻塞函数
 * @param  {number} ms 时间，毫秒
 */
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
/**
 * @description 同步阻塞函数。
 * @param {number} time - 延迟的时间量，单位为毫秒
 */
const delay = (time = 0) => {
};
/**
 * @function
 * @description 数据安全访问
 * @param  {any} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {any} argValue [如果数据有误，返回的值，选填]
 * @param  {boolean|0|1} argSetValueForce [是否强制赋值argValue]
 * @returns {any}
 */
const safe = function safe(argData, argCheck, argValue, argSetValueForce) {
    return safeData(argData, argCheck, argValue, argSetValueForce);
};
/**
 * @function
 * @description 数据安全访问
 * @param  {any} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {any} argValue [如果数据为undefined/null,返回argValue，选填]
 * @param  {boolean|0|1} argSetValueForce [是否强制赋值argValue,强制赋值时只返回true/false]
 * @returns {any}
 */
const safeData = (argData, argCheck, argValue = undefined, argSetValueForce) => {
    if (typeof argCheck !== 'string' && typeof argCheck !== 'number') {
        console.warn('argCheck请传入string当前为:' + argCheck);
        return '';
    }
    const temKey = argCheck.toString().split('.');
    const temLen = temKey.length;
    if (!argData) {
        return argValue;
    }
    if (temLen > 1) {
        for (let i = 0; i < temLen - 1; i++) {
            if (typeof argData[temKey[i]] !== 'object') {
                if (argSetValueForce) {
                    console.warn('safeData setValue err，data:', argData, 'no key:', argCheck);
                    return false;
                }
                else {
                    console.warn('noData return argValue', i);
                    return argValue;
                }
            }
            argData = argData[temKey[i]] || {};
        }
    }
    if (argSetValueForce) {
        argData[temKey[temLen - 1]] = argValue;
        return true;
    }
    if (typeof argValue === 'undefined') {
        return argData[temKey[temLen - 1]];
    }
    else {
        return argData[temKey[temLen - 1]] ?? argValue;
    }
};
/**
 * @description obj转url参数
 * @function
 * @param {any} argParams 参数对象
 * @param {boolean?} noMark 默认带?,true时,不带
 * @returns {string}
 */
const setUrlParams = (argParams, noMark) => {
    let re = '';
    if (!noMark) {
        re = '?';
    }
    let paramsList = Object.keys(argParams);
    let temLength = paramsList.length;
    if (!temLength) {
        return '';
    }
    paramsList.map((v, k) => {
        re += v + '=' + argParams[v];
        if (k < temLength - 1) {
            re += '&';
        }
    });
    return re;
};
/**
 * @description 获取url参数
 * @function
 * @param {string} argName 要获取的key
 * @param {string} argUrl url数据
 * @returns {string}
 */
const getUrlParam = (argName, argUrl = globalThis.location.search || '') => {
    let result = argUrl.match(new RegExp('[?&]' + argName + '=([^&]+)', 'i'));
    if (!result) {
        return '';
    }
    return decodeURIComponent(result[1]);
};
/**
 * @description 获取所有url参数，eg: a=1&b=2 to {a:1,b:2}
 * @function
 * @param {string} argData 要处理的数据
 * @returns {any}
 */
const getUrlParamObj = (argData = globalThis.location.search || globalThis.location.hash) => {
    const res = {};
    try {
        argData
            .slice(argData.indexOf('?') + 1)
            .split('&')
            .forEach((v) => {
            const [key, val] = v.split('=');
            if (key !== v) {
                res[key] = decodeURIComponent(val);
            }
        });
        return res;
    }
    catch (e) {
        console.error('转换失败', e);
        return res;
    }
    // let temObj = new URLSearchParams(argData)
    // let resObj = {}
    // for (const [key, value] of temObj) {
    //   resObj[key] = value
    // }
    // return resObj
};
/**
 * @description 通过正则匹配修改当前页面的url中的参数
 * @function
 * @param  {string} name key
 * @param  {string | number| undefined | null} value 要替换的value
 * @param  {string} url 要替换的网址,默认location.href
 * @returns {string}
 */
const replaceUrlParam = (name, value, url = globalThis.location.href || '') => {
    const reg = new RegExp('([?]|&)(' + name + '=)([^&#]*)([&]?|$)', 'img');
    const r = url.match(reg);
    const search = url.split('?');
    let strValue = url;
    if (value === undefined || value === null) {
        if (r != null) {
            strValue = url.replace(reg, (_match, p1, _p2, _p3, p4) => {
                if (!p4 || !p4.length) {
                    return '';
                }
                else if (p1 === p4) {
                    return p1;
                }
                return p1 + p4;
            });
            strValue = strValue.replace('?&', '?');
        }
    }
    else if (r != null) {
        strValue = url.replace(reg, `$1$2${value}$4`);
    }
    else if (search.length > 1) {
        const sub = search[1].split('#');
        if (sub.length > 1) {
            if (sub[1].length) {
                strValue = `${search[0]}?${sub[0]}&${name}=${value}#${sub[1]}`;
            }
            else {
                strValue = `${search[0]}?${sub[0]}&${name}=${value}${sub[1]}`;
            }
        }
        else {
            strValue = `${search[0]}?${search[1]}&${name}=${value}`;
        }
    }
    else {
        // 不存在?时,搜索hash
        const sub = url.split('#');
        if (sub.length > 1) {
            strValue = `${sub[0]}?${name}=${value}#${sub[1]}`;
        }
        else {
            strValue = `${url}?${name}=${value}`;
        }
    }
    return strValue;
};
/**
 * @function
 * @description 获取简单uuid
 * @returns {string} uuid
 */
const getUuid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + Date.now();
};
/**
 * @function
 * @description 获取随机数,含最大值，含最小值
 * @param  {number} min 最小值
 * @param  {number} max 最大值
 * @returns {number}
 */
const randomInt = (min = 0, max = 100) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    // 含最大值，含最小值
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * @function
 * @description 设置env参数，一般在main.js中调用
 * @param  {AnyObject} env 要设置的值
 * @example
 * setEnv(import.meta.env)
 */
const setEnv = (env) => {
    ENV = env;
};
/**
 * @function
 * @description 获取env参数
 * @param  {string} key 要获取的值
 * @returns {string} 获取的值
 */
const getEnv = (key) => {
    return safeData(ENV, key, '');
};
/**
 * @function
 * @description 设置object参数,可做运行时缓存
 * @param  {string} key 要设置的key
 * @param  {AnyObject} data 要设置的值
 * @returns {AnyObject}
 */
const setObj = (key, data) => {
    if (!key) {
        DATA_OBJECT = data;
    }
    else {
        DATA_OBJECT[key] = data;
    }
    return DATA_OBJECT;
};
/**
 * @function
 * @description 获取object参数
 * @param  {string} key 要获取的值
 * @param  {string} argData 要合并的值
 * @param  {boolean} isDeepCopy 是否深拷贝
 * @returns {AnyObject} 获取的值
 */
const getObj = (key, argData, isDeepCopy) => {
    let res = safeData(DATA_OBJECT, key, {});
    if (typeof res !== 'object') {
        console.warn('DATA_OBJECT.' + key + ' is not a object');
        return res;
    }
    if (isDeepCopy) {
        res = deepCopy(res);
    }
    if (argData) {
        Object.assign(res, argData);
    }
    return res;
};
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
const setLog = (logLevel = 4, logConfig = { error: 0 }) => {
    // 1 error 2 warn 3 info 4 log 5 debug
    logLevel = logLevel || getEnv('VUE_APP_LOG_LEVEL') || 4;
    const logList = ['log', 'info', 'warn', 'error'];
    const log = {};
    logList.forEach((v) => {
        log[v] = console[v];
    });
    for (let key in logConfig) {
        if (console[key]) {
            console[key] = (...arg) => {
                const line = safeData(Error(), 'stack', [])?.split('\n')[2] || '';
                log[key](...arg, 'line>>' + line);
                // 回调处理
                typeof logConfig[key] === 'function' && logConfig[key](...arg, line);
            };
        }
    }
    switch (+logLevel) {
        case 1:
            console.warn = () => { };
        case 2:
            console.info = () => { };
        case 3:
            console.log = () => { };
        case 4:
            console.debug = () => { };
    }
    // return log
};
/**
 * @function
 * @description深拷贝函数
 * @param obj 需要拷贝的对象
 * @returns 拷贝后的对象
 */
const deepCopy = (obj, hash = new WeakMap()) => {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj);
    if (obj instanceof RegExp)
        return new RegExp(obj);
    if (obj instanceof Map)
        return new Map(deepCopy(Array.from(obj), hash));
    if (obj instanceof Set)
        return new Set(deepCopy(Array.from(obj), hash));
    if (hash.has(obj))
        return hash.get(obj);
    const copy = Array.isArray(obj)
        ? []
        : Object.create(Object.getPrototypeOf(obj));
    hash.set(obj, copy);
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = deepCopy(obj[key], hash);
        }
    }
    return copy;
};
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
const requestDeviceMotionPermission = () => {
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
        return DeviceMotionEvent
            .requestPermission()
            .then((permissionState) => {
            if (permissionState === 'granted') {
                return true;
            }
            else {
                return false;
            }
        })
            .catch(() => {
            return false;
        });
    }
    else {
        return true;
    }
};
/**
 * @function
 * @description 自动播放音频并返回音频元素。
 * @param {string} audioUrl - 音频地址
 * @param {boolean} isWeixin - 是否在微信中
 * @returns {HTMLAudioElement} - 音频元素
 */
const autoPlayAudio = (audioUrl, isWeixin) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    audio.autoplay = true;
    if (isWeixin) {
        document.addEventListener('WeixinJSBridgeReady', function () {
            audio.play();
        }, false);
    }
    return audio;
};
/**
 * @function
 * @description 函数防抖，用于限制函数调用的频率。
 * @param {Function} func - 要进行防抖的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @return {Function} 返回防抖后的函数
 * @example
 * ```
 * const debouncedHello = debounce(sayHello, 1000);
 * debouncedHello('Hello from 1');
 * debouncedHello('Hello from 2');
 * ```
 */
const debounce = (fn, delay = 300, ...extra) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.call(this, ...args, ...extra);
        }, delay);
    };
};
/**
 * @function
 * @description 节流函数:该函数用于限制函数的执行频率，使其在指定的时间间隔内最多执行一次
 * @param {Function} fn - 要节流的函数。
 * @param {number} [delay=300] - 函数执行之间的延迟时间（毫秒）。默认为 300 毫秒。
 * @param {...any} extra - 可选的额外参数，传递给节流函数的原始调用。
 * @returns {Function} 返回一个新的函数，该函数具有节流行为。
 * @example
 * ```
 * const sayHelloFn = (a: string,b:any) => {
 *   console.log(a,b);
 * }
 * const throttleHello = throttle(sayHelloFn, 300,'extra info);
 * throttleHello('Hello from 1');
 * throttleHello('Hello from 2');
 * // Hello from 1 extra info
 * ```
 */
const throttle = (fn, delay = 300, ...extra) => {
    let temTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - temTime > delay) {
            temTime = now;
            fn.call(this, ...args, ...extra);
        }
    };
};
/**
 * @function
 * @description 添加事件绑定
 * @param {Element} el - 绑定元素
 * @param {string} event - 事件名称
 * @param {function} handler - 事件处理函数
 */
const on = (function () {
    if (typeof globalThis.document?.addEventListener === 'function') {
        return function (el, event, handler) {
            if (el && event && handler) {
                el.addEventListener(event, handler, false);
            }
        };
    }
    return function (el, event, handler) {
        if (el && event && handler) {
            el.attachEvent('on' + event, handler);
        }
    };
})();
/**
 * @function
 * @description 移除事件绑定
 * @param {Element} el - 绑定元素
 * @param {string} event - 事件名称
 * @param {function} handler - 事件处理函数
 */
const off = (function () {
    if (typeof globalThis.document?.removeEventListener === 'function') {
        return function (el, event, handler) {
            if (el && event) {
                el.removeEventListener(event, handler, false);
            }
        };
    }
    return function (el, event, handler) {
        if (el && event) {
            el.detachEvent('on' + event, handler);
        }
    };
})();

export { autoPlayAudio, debounce, deepCopy, delCookie, delay, getCookie, getCookieObj, getEnv, getInfo, getNetworkStatus, getObj, getRandomColor, getRegexp, getStorage, getUrlParam, getUrlParamObj, getUuid, off, on, randomInt, remInit, replaceUrlParam, requestDeviceMotionPermission, safe, safeData, setCookie, setEnv, setLog, setObj, setStorage, setTitle, setUrlParams, sleep, throttle };
