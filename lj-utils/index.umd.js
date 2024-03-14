(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ljFn = {}));
})(this, (function (exports) { 'use strict';

    /**
     * @module index
     * @author linjielinlin 993353454@qq.com
     * @date 2022-05-11 22:07:43
     * @description 判断函数
     */
    /**
     * @function isPrime
     * @description 判断一个数是否为质数
     * @param {number} argValue 需要判断的数值
     * @returns {boolean} 如果是质数返回true，否则返回false
     * @example
     * isPrime(5); // true
     */
    const isPrime = (argValue) => !/^.?$|^(..+?)\1+$/.test('.'.repeat(argValue));
    /**
     * @function isJson
     * @description 判断一个值是否为JSON
     * @param  {any} argData 需要判断的数据
     * @returns {boolean} 如果是JSON返回true，否则返回false
     * @example
     * isJson('{"name":"John"}'); // true
     */
    const isJson = (argData) => {
        try {
            return typeof JSON.parse(argData || '') === 'object';
        }
        catch (e) { }
        return false;
    };
    /**
     * @function isBlob
     * @description 判断一个值是否为Blob
     * @param  {any} argData 需要判断的数据
     * @returns {boolean} 如果是Blob返回true，否则返回false
     * @example
     * isBlob(new Blob()); // true
     */
    const isBlob = (argData) => {
        return argData instanceof Blob;
    };
    /**
     * @function isFile
     * @description 判断一个值是否为File
     * @param  {any} argData 需要判断的数据
     * @returns {boolean} 如果是File返回true，否则返回false
     * @example
     * isFile(new File([""], "filename")); // true
     */
    const isFile = (argData) => {
        return argData instanceof File;
    };
    /**
     * @function isIdCard
     * @description 判断一个字符串是否为正确的身份证号码
     * @param  {string} code 身份证号码
     * @returns {boolean} 如果是正确的身份证号码返回true，否则返回false
     * @example
     * isIdCard('320311770706001'); // false
     */
    const isIdCard = (code) => {
        let tip = '';
        let city = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江 ',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北 ',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏 ',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆',
            71: '台湾',
            81: '香港',
            82: '澳门',
            91: '国外 ',
        };
        let pass = true;
        if (!code ||
            !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            tip = '身份证号格式错误';
            pass = false;
        }
        else if (!city[+code.substring(0, 2)]) {
            tip = '地址编码错误';
            pass = false;
        }
        else {
            // 18位身份证需要验证最后一位校验位
            if (code.length === 18) {
                const codeArr = code.split('');
                // ∑(ai×Wi)(mod 11)
                // 加权因子
                let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                // 校验位
                let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                let sum = 0;
                let ai = 0;
                let wi = 0;
                for (let i = 0; i < 17; i++) {
                    ai = Number(codeArr[i]);
                    wi = factor[i];
                    sum += ai * wi;
                }
                let last = parity[sum % 11] + '';
                if (last !== code[17]) {
                    tip = '校验位错误';
                    pass = false;
                }
            }
        }
        console.assert(!tip, tip);
        return pass;
    };

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
        if (!argData) {
            return argValue;
        }
        if (typeof argCheck !== 'string' && typeof argCheck !== 'number') {
            console.warn('argCheck请传入string当前为:' + argCheck);
            return '';
        }
        const temKey = argCheck.toString().split('.');
        const temLen = temKey.length;
        if (temLen > 1) {
            for (let i = 0; i < temLen - 1; i++) {
                if (typeof argData[temKey[i]] !== 'object') {
                    if (argSetValueForce) {
                        console.warn('safeData setValue err：', argData, 'index:', i);
                    }
                    return argValue;
                }
                argData = argData[temKey[i]] || {};
            }
        }
        if (argSetValueForce) {
            argData[temKey[temLen - 1]] = argValue;
        }
        if (typeof argValue === 'undefined') {
            return argData[temKey[temLen - 1]];
        }
        else {
            return argData[temKey[temLen - 1]] || argValue;
        }
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
    const safeData = (argData, argCheck, argValue, argSetValueForce) => {
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
                        console.warn('safeData setValue err：', argData, 'index:', i);
                    }
                    else {
                        return argValue;
                    }
                }
                argData = argData[temKey[i]] || {};
            }
        }
        if (argSetValueForce) {
            argData[temKey[temLen - 1]] = argValue;
        }
        if (typeof argValue === 'undefined') {
            return argData[temKey[temLen - 1]];
        }
        else {
            return argData[temKey[temLen - 1]] || argValue;
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
        if (argData) {
            res = Object.assign(res, argData);
        }
        if (!isDeepCopy) {
            return res;
        }
        else {
            return JSON.parse(JSON.stringify(res));
        }
    };
    /**
     * @function
     * @description 设置日志输出logLevel 1 error 2 warn 3 info 4 log 5 debug
     * @param {AnyObject} logConfig 重写配置
     * @param {function} logConfig.error 错误日志回调（做额外处理用）
     */
    const setLog = (logLevel, logConfig) => {
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
                    log[key](...arg, Error().stack?.split('\n')[2]);
                    // 回调处理
                    logConfig[key] && logConfig[key](...arg, Error().stack?.split('\n')[2]);
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
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
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
    const debounce = function (func, delay) {
        let timeoutIdMap = new Map();
        return function (...args) {
            // @ts-ignore
            const context = this;
            const key = JSON.stringify(args);
            clearTimeout(timeoutIdMap.get(key));
            const timeoutId = setTimeout(() => {
                func.apply(context, args);
                timeoutIdMap.delete(key);
            }, delay);
            timeoutIdMap.set(key, timeoutId);
        };
    };

    /**
     * @module index
     * @author linjielinlin 993353454@qq.com
     * @date 2022-05-11 22:07:43
     * @description 文件相关处理
     */
    /**
     * @function blobToBase64
     * @description 将Blob对象转换为base64字符串
     * @date 2020-03-01
     * @param {Blob} argBlob 需要处理的Blob对象
     * @returns {Promise} 返回base64字符串
     * @example
     * blobToBase64(blob).then(base64 => console.log(base64));
     */
    const blobToBase64 = async (argBlob) => {
        // eslint-disable-next-line no-undef
        const fileReader = new FileReader();
        fileReader.readAsDataURL(argBlob);
        fileReader.onload = (e) => {
            return Promise.resolve(e && e.target && e.target.result);
        };
        fileReader.onerror = () => {
            return Promise.reject(new Error('文件流异常'));
        };
    };
    /**
     * @function blobUrlToFile
     * @description 将blobUrl转换为File对象
     * @date 2020-03-01
     * @param {string} argData blobUrl
     * @returns {Promise} 返回File对象
     * @example
     * blobUrlToFile(url).then(file => console.log(file));
     */
    const blobUrlToFile = async (argData) => {
        return new Promise(function (resolve, reject) {
            // eslint-disable-next-line no-undef
            var xhr = new XMLHttpRequest();
            xhr.open('GET', argData, true);
            xhr.responseType = 'blob';
            xhr.onload = function (e) {
                if (this.status === 200) {
                    return resolve(this.response);
                }
            };
            xhr.onerror = (err) => {
                return reject(err);
            };
            xhr.send();
        });
    };
    /**
     * @function dataURLtoBlob
     * @description 将图片的dataUrl base64转换为Blob对象
     * @param {string} argData dataUrl
     * @returns {Blob} 返回Blob对象
     * @example
     * const blob = dataURLtoBlob(dataUrl);
     */
    const dataURLtoBlob = (argData) => {
        if (!argData.match(/;base64,/)) {
            return new Blob();
        }
        let arr = argData.split(',');
        let mime = safeData(arr[0].match(/:(.*?);/), '1', '');
        if (!mime) {
            return new Blob();
        }
        let bstr = globalThis.atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };
    /**
     * @function blobToFile
     * @description 将Blob对象转换为File对象
     * @param {Blob} argBlob Blob对象
     * @param {string} argName 文件名，默认为当前时间戳
     * @returns {File} 返回File对象
     * @example
     * const file = blobToFile(blob, 'example.txt');
     */
    const blobToFile = (argBlob, argName = Date.now().toString()) => {
        let file = new File([argBlob], argName, {
            type: argBlob.type,
        });
        return file;
    };
    /**
     * @function dlFile
     * @description 下载文件
     * @param {string|Blob|File} argData Blob对象/File对象/dataUrl/base64
     * @param {string} argName 文件名
     * @param {number} argDelTime 移除dateUrl时间
     * @example
     * dlFile(data, 'example.txt', 10000);
     */
    const dlFile = (argData, argName = Date.now().toString(), argDelTime = 10000) => {
        let downNode = globalThis.document.createElement('a');
        downNode.download = argName;
        // 字符内容转换为blob地址
        let href = '';
        if (typeof argData === 'string') {
            if (argData.startsWith('blob:')) {
                href = argData;
            }
            else if (argData.startsWith('data:')) {
                href = argData;
            }
            argData = new Blob([argData]);
        }
        href = href || URL.createObjectURL(argData);
        downNode.href = href;
        setTimeout(() => {
            URL.revokeObjectURL(href);
        }, argDelTime);
        globalThis.document.body.appendChild(downNode);
        downNode.click();
        globalThis.document.body.removeChild(downNode);
    };
    /**
     * @function getDuration
     * @description 获取音视频文件的时长
     * @param {Blob|File|string} argFile 音视频数据，如果是string类型，则为链接
     * @returns {Promise} 返回时长（单位：秒）
     * @example
     * getDuration(file).then(duration => console.log(duration));
     */
    const getDuration = async (argFile) => {
        let filePath;
        if (typeof argFile === 'string') {
            filePath = argFile;
        }
        else {
            filePath = URL.createObjectURL(argFile);
        }
        return new Promise((resolve, reject) => {
            const audio = new Audio(filePath);
            audio.addEventListener('loadedmetadata', function (e) {
                if (filePath.startsWith('blob:')) {
                    URL.revokeObjectURL(filePath);
                }
                const duration = audio.duration;
                audio.src = '';
                return resolve(duration);
            });
            setTimeout(() => {
                return reject(new Error('读取时长超时'));
            }, 5000);
        });
    };
    /**
     * @function loadFile
     * @description 动态加载html文件标签
     * @param {string} argUrl 要加载的url
     * @param {string} argType 加载类型 js/css
     * @param {object} argOptions
     * @param {string} argOption.disCheck 不检查是否有相同标签
     * @param {string} argOption.force 是否强制添加，true时先删除再添加
     * @return {Promise} 返回Promise对象
     * @example
     * loadFile(url, 'js', {force: true}).then(() => console.log('Loaded'));
     */
    const loadFile = (argUrl, argType = 'js', argOptions = {}) => {
        let temId = argType + '-' + argUrl.split('/').pop();
        let head = globalThis.document.getElementsByTagName('head')[0];
        let nodeTag;
        if (!argOptions.disCheck) {
            let checkTag = globalThis.document.getElementById(temId);
            // 已经存在对应tag
            if (checkTag) {
                if (argOptions.force) {
                    head.removeChild(checkTag);
                }
                else {
                    return Promise.resolve({ msg: '已存在，中断加载！' });
                }
            }
        }
        switch (argType) {
            case 'css':
                nodeTag = globalThis.document.createElement('link');
                nodeTag.type = 'text/css';
                nodeTag.rel = 'stylesheet';
                nodeTag.href = argUrl;
                break;
            case 'js':
                nodeTag = globalThis.document.createElement('script');
                nodeTag.src = argUrl;
                nodeTag.type = 'text/javascript';
                break;
            default:
                console.error('暂不支持：' + argType);
                return Promise.reject({ msg: '暂不支持：' + argType });
        }
        nodeTag.id = temId;
        head.appendChild(nodeTag);
        return new Promise((resolve) => {
            if (nodeTag.readyState) {
                nodeTag.onreadystatechange = function () {
                    if (nodeTag.readyState === 'complete') {
                        nodeTag.onreadystatechange = null;
                        return resolve(argUrl);
                    }
                };
            }
            else {
                // Others
                nodeTag.onload = function () {
                    return resolve(argUrl);
                };
            }
        });
    };

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

    exports.arrayToObj = arrayToObj;
    exports.autoPlayAudio = autoPlayAudio;
    exports.blobToBase64 = blobToBase64;
    exports.blobToFile = blobToFile;
    exports.blobUrlToFile = blobUrlToFile;
    exports.dataURLtoBlob = dataURLtoBlob;
    exports.debounce = debounce;
    exports.decodeHtml = decodeHtml;
    exports.deepCopy = deepCopy;
    exports.delCookie = delCookie;
    exports.delay = delay;
    exports.dlFile = dlFile;
    exports.encodeHtml = encodeHtml;
    exports.formatNumber = formatNumber;
    exports.formatSize = formatSize;
    exports.formatTime = formatTime;
    exports.friendlyTime = friendlyTime;
    exports.getCookie = getCookie;
    exports.getCookieObj = getCookieObj;
    exports.getDuration = getDuration;
    exports.getEnv = getEnv;
    exports.getInfo = getInfo;
    exports.getNetworkStatus = getNetworkStatus;
    exports.getObj = getObj;
    exports.getRandomColor = getRandomColor;
    exports.getRegexp = getRegexp;
    exports.getStorage = getStorage;
    exports.getUrlParam = getUrlParam;
    exports.getUrlParamObj = getUrlParamObj;
    exports.getUuid = getUuid;
    exports.hideInfo = hideInfo;
    exports.isBlob = isBlob;
    exports.isFile = isFile;
    exports.isIdCard = isIdCard;
    exports.isJson = isJson;
    exports.isPrime = isPrime;
    exports.loadFile = loadFile;
    exports.objToArray = objToArray;
    exports.objToObj = objToObj;
    exports.px2vw = px2vw;
    exports.randomInt = randomInt;
    exports.remInit = remInit;
    exports.replaceUrlParam = replaceUrlParam;
    exports.requestDeviceMotionPermission = requestDeviceMotionPermission;
    exports.rmbPrice = rmbPrice;
    exports.safe = safe;
    exports.safeData = safeData;
    exports.secondToTime = secondToTime;
    exports.setCookie = setCookie;
    exports.setEnv = setEnv;
    exports.setLog = setLog;
    exports.setObj = setObj;
    exports.setStorage = setStorage;
    exports.setTitle = setTitle;
    exports.setUrlParams = setUrlParams;
    exports.sleep = sleep;
    exports.string10to62 = string10to62;
    exports.string62to10 = string62to10;
    exports.toFixed = toFixed;
    exports.toHump = toHump;
    exports.toLine = toLine;

}));
