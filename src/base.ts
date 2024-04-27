/**
 * @module index
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 公共函数，使用'lj-utils'引入
 */

import { isJson } from './is'
import { Info, AnyObject, Bool } from './types'

let isOnline: boolean = true
let ENV: AnyObject = {}
let DATA_OBJECT: AnyObject = {}
// 断网监听
if (globalThis && globalThis.addEventListener) {
  // #ifdef H5
  globalThis.addEventListener('offline', function () {
    console.debug('offLine')
    isOnline = false
  })
  globalThis.addEventListener('online', function () {
    console.debug('onLine')
    isOnline = true
  })
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
export const getNetworkStatus = () => {
  return isOnline
}

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
export const getRegexp = (): AnyObject => {
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
    realName:
      /^([\u4e00-\u9fa5]{1,50}|[\u4e00-\u9fa5]{1,25}[\s][\u4e00-\u9fa5]{1,24}|[a-zA-Z_\-.]{1,50}|[a-zA-Z_\-.]{1,25}[\s][a-zA-Z_\-.]{1,24})$/,
    // 匹配中文
    cn: /^[\u4e00-\u9fa5]*$/,
    // 匹配ASCII,非中文之外的字符（全角字符）
    ascii: /^[\x20-\x7E]+$/,
  }
}

/**
 * @function
 * @description 设置标题
 * @param  {string} argTitle 标题
 */
export const setTitle = (argTitle: string | number) => {
  if (typeof globalThis.document === 'object') {
    globalThis.document.title = String(argTitle)
  }
  if (getInfo().isAppleMobile) {
    const i = document.createElement('iframe')
    i.onload = () => {
      setTimeout(() => {
        console.debug('apple mobile setting title')
        i.remove()
      }, 10)
    }
    globalThis.document.body.appendChild(i)
  }
}

/**
 * @function
 * @description 使用postcss-px2rem时使用
 * @param {number} argBaseSize 基础大小 16px（要跟配置一致）
 * @param {number} argWidth 基准宽度
 */
export const remInit = (argBaseSize: number = 16, argWidth: number = 375) => {
  // 设置 rem 函数
  const setRem = () => {
    // 当前页面宽度相对于 argWidth 宽的缩放比例，可根据自己需要修改。
    const scale =
      safeData(globalThis, 'document.documentElement.clientWidth', argWidth) /
      argWidth
    // 设置页面根节点字体大小
    safeData(
      globalThis,
      'document.documentElement.style.fontSize',
      argBaseSize * scale + 'px',
      true
    )
  }
  // 初始化
  setRem()
  // 改变窗口大小时重新设置 rem
  globalThis.onresize = () => {
    setRem()
  }
}

/**
 * @function
 * @description 获取cookie
 * @param  {string} argName 要获取的值
 * @returns {string}
 */
export const getCookie = (argName: string): string => {
  const cookies = globalThis.document.cookie.split('; ')
  const cookie = cookies.find((cookie) => {
    const [name] = cookie.split('=')
    return argName === name
  })
  return cookie ? decodeURIComponent(cookie.split('=')[1] || '') : ''
}
/**
 * @function
 * @description 获取cookie对象
 * @returns {object}
 */
export const getCookieObj = (): { [key: string]: string } => {
  const cookies = globalThis.document.cookie.split('; ')
  const cookieObj: { [key: string]: string } = {}
  cookies.forEach((cookie) => {
    const [key, value = ''] = cookie.split('=')
    cookieObj[key] = decodeURIComponent(value)
  })
  return cookieObj
}
/**
 * @function
 * @description 设置cookie
 * @param  {string} argName 要设置的key
 * @param  {string} argValue 要设置的value
 * @param  {number} argTime 过期时间/时 默认24
 * @param  {number} argPath path
 * @param  {number} domain domain
 */
export const setCookie = (
  argName: string,
  argValue: string | number | boolean = '',
  argTime: number = 24,
  argPath: string = '/',
  domain: string = globalThis.location.hostname
) => {
  if (argTime === 0) {
    globalThis.document.cookie = `${argName}=${encodeURIComponent(
      argValue
    )};path=${argPath};domain=${domain};`
  } else {
    const now = new Date()
    const offset = 8
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    const nd = utc + 3600000 * offset
    const exp = new Date(nd)
    exp.setTime(exp.getTime() + argTime * 60 * 60 * 1000)
    globalThis.document.cookie = `${argName}=${encodeURIComponent(
      argValue
    )};path=${argPath};expires=${exp.toUTCString()};domain=${domain};`
  }
}

/**
 * @function
 * @description 清除cookie
 * @param  {string} argName 要清除的值
 */
export const delCookie = (argName: string = '') => {
  setCookie(argName, '', -1)
}

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
export const getInfo = (): Info => {
  let ua = safeData(globalThis, 'navigator.userAgent', '').toLowerCase()
  let platform: string = safeData(
    globalThis,
    'navigator.userAgentData.platform',
    ''
  ).toLowerCase()
  let info: Info = {
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
  }
  if (info.ua.match('msie')) {
    let IE = info.ua.match(/msie\s([0-9]*)/)
    if (IE && IE.length >= 2) {
      info.ieVersion = +IE[1]
    }
  }
  info.isAppleMobile = !!(
    info.isMobile &&
    ua.toLowerCase().indexOf('applewebkit') &&
    ua.indexOf('chrome') < 1
  )
  return info
}

/**
 * @function
 * @description 获取随机颜色
 * @return string
 */
export const getRandomColor = function () {
  return (
    '#' +
    ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substring(-6)
  )
}

/**
 * @function
 * @description 获取storage的值，默认将json转为obj
 * @param {string} argKey 要获取的key
 * @param {string} argNoJson true时不自动转换JSON字符串
 * @returns {any} key对应的数据
 */
export const getStorage = (argKey: string, argNoJson?: string): any => {
  let res = globalThis.localStorage.getItem(argKey)
  // 默认转义JSON字符串
  if (!argNoJson && isJson(res) && res) {
    res = JSON.parse(res)
  }
  return res || ''
}

/**
 * @function
 * @description 设置storage的值，默认将obj转为json
 * @param {string} argKey 要获取的key
 * @param {unknown} argData 要保存的数据
 * @returns {string} 保存的数据String
 */
export const setStorage = (argKey: string, argData: unknown): string => {
  if (typeof argData === 'object') {
    argData = JSON.stringify(argData)
  }
  globalThis.localStorage.setItem(argKey, String(argData))
  return String(argData)
}

/**
 * @function
 * @description setTimeout promise版，异步阻塞函数
 * @param  {number} ms 时间，毫秒
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
/**
 * @description 同步阻塞函数。
 * @param {number} time - 延迟的时间量，单位为毫秒
 */
export const delay = (time: number = 0) => {
  let start = Date.now()
  while (Date.now() - start < time) {
    continue
  }
}

// 返回T下的key对应类型
type KeyOf<T extends Record<string, any>, K = keyof T> = K extends string
  ? T[K] extends Function
    ? never
    : K
  : never
type DotField<T extends Record<string, any>, K = KeyOf<T>> = K extends string
  ? K | `${K}.${DotField<T[K]>}`
  : never
// 返回传入K或T[K]对应的类型
type ValueOf<
  T extends Record<string, any>,
  K
> = K extends `${infer I}.${infer R}`
  ? ValueOf<T[I], R>
  : K extends string
  ? T[K]
  : never

/**
 * @function
 * @description 数据安全访问
 * @param  {any} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {any} argValue [如果数据有误，返回的值，选填]
 * @param  {boolean|0|1} argSetValueForce [是否强制赋值argValue]
 * @returns {any}
 */
export const safe = function safe<
  T extends Record<string, any>,
  K extends DotField<T>
>(
  argData: T,
  argCheck: K,
  argValue?: ValueOf<T, K>,
  argSetValueForce?: Bool
): ValueOf<T, K> | undefined | string | boolean {
  return safeData(argData, argCheck, argValue, argSetValueForce)
}
/**
 * @function
 * @description 数据安全访问
 * @param  {any} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {any} argValue [如果数据为undefined/null,返回argValue，选填]
 * @param  {boolean|0|1} argSetValueForce [是否强制赋值argValue,强制赋值时只返回true/false]
 * @returns {any}
 */
export const safeData = (
  argData: any,
  argCheck: string,
  argValue: any = undefined,
  argSetValueForce?: Bool
): any => {
  if (typeof argCheck !== 'string' && typeof argCheck !== 'number') {
    console.warn('argCheck请传入string当前为:' + argCheck)
    return ''
  }
  const temKey = argCheck.toString().split('.')
  const temLen = temKey.length
  if (!argData) {
    return argValue
  }
  if (temLen > 1) {
    for (let i = 0; i < temLen - 1; i++) {
      if (typeof argData[temKey[i]] !== 'object') {
        if (argSetValueForce) {
          console.warn(
            'safeData setValue err，data:',
            argData,
            'no key:',
            argCheck
          )
          return false
        } else {
          console.warn('noData return argValue', i)
          return argValue
        }
      }
      argData = argData[temKey[i]] || {}
    }
  }
  if (argSetValueForce) {
    argData[temKey[temLen - 1]] = argValue
    return true
  }
  if (typeof argValue === 'undefined') {
    return argData[temKey[temLen - 1]]
  } else {
    return argData[temKey[temLen - 1]] ?? argValue
  }
}

/**
 * @description obj转url参数
 * @function
 * @param {any} argParams 参数对象
 * @param {boolean?} noMark 默认带?,true时,不带
 * @returns {string}
 */
export const setUrlParams = (argParams: any, noMark?: boolean): string => {
  let re = ''
  if (!noMark) {
    re = '?'
  }
  let paramsList = Object.keys(argParams)
  let temLength = paramsList.length
  if (!temLength) {
    return ''
  }
  paramsList.map((v, k) => {
    re += v + '=' + argParams[v]
    if (k < temLength - 1) {
      re += '&'
    }
  })
  return re
}

/**
 * @description 获取url参数
 * @function
 * @param {string} argName 要获取的key
 * @param {string} argUrl url数据
 * @returns {string}
 */
export const getUrlParam = (
  argName: string,
  argUrl: string = globalThis.location.search || ''
): string => {
  let result = argUrl.match(new RegExp('[?&]' + argName + '=([^&]+)', 'i'))
  if (!result) {
    return ''
  }
  return decodeURIComponent(result[1])
}

/**
 * @description 获取所有url参数，eg: a=1&b=2 to {a:1,b:2}
 * @function
 * @param {string} argData 要处理的数据
 * @returns {any}
 */
export const getUrlParamObj = (
  argData: string = globalThis.location.search || globalThis.location.hash
): AnyObject => {
  const res: AnyObject = {}
  try {
    argData
      .slice(argData.indexOf('?') + 1)
      .split('&')
      .forEach((v) => {
        const [key, val] = v.split('=')
        if (key !== v) {
          res[key] = decodeURIComponent(val)
        }
      })
    return res
  } catch (e) {
    console.error('转换失败', e)
    return res
  }
  // let temObj = new URLSearchParams(argData)
  // let resObj = {}
  // for (const [key, value] of temObj) {
  //   resObj[key] = value
  // }
  // return resObj
}

/**
 * @description 通过正则匹配修改当前页面的url中的参数
 * @function
 * @param  {string} name key
 * @param  {string | number| undefined | null} value 要替换的value
 * @param  {string} url 要替换的网址,默认location.href
 * @returns {string}
 */
export const replaceUrlParam = (
  name: string,
  value: string | number | undefined | null,
  url: string = globalThis.location.href || ''
): string => {
  const reg = new RegExp('([?]|&)(' + name + '=)([^&#]*)([&]?|$)', 'img')
  const r = url.match(reg)
  const search = url.split('?')
  let strValue: string = url
  if (value === undefined || value === null) {
    if (r != null) {
      strValue = url.replace(reg, (_match, p1, _p2, _p3, p4) => {
        if (!p4 || !p4.length) {
          return ''
        } else if (p1 === p4) {
          return p1
        }
        return p1 + p4
      })
      strValue = strValue.replace('?&', '?')
    }
  } else if (r != null) {
    strValue = url.replace(reg, `$1$2${value}$4`)
  } else if (search.length > 1) {
    const sub = search[1].split('#')
    if (sub.length > 1) {
      if (sub[1].length) {
        strValue = `${search[0]}?${sub[0]}&${name}=${value}#${sub[1]}`
      } else {
        strValue = `${search[0]}?${sub[0]}&${name}=${value}${sub[1]}`
      }
    } else {
      strValue = `${search[0]}?${search[1]}&${name}=${value}`
    }
  } else {
    // 不存在?时,搜索hash
    const sub = url.split('#')
    if (sub.length > 1) {
      strValue = `${sub[0]}?${name}=${value}#${sub[1]}`
    } else {
      strValue = `${url}?${name}=${value}`
    }
  }
  return strValue
}

/**
 * @function
 * @description 获取简单uuid
 * @returns {string} uuid
 */
export const getUuid = (): string => {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + Date.now()
}

/**
 * @function
 * @description 获取随机数,含最大值，含最小值
 * @param  {number} min 最小值
 * @param  {number} max 最大值
 * @returns {number}
 */
export const randomInt = (min: number = 0, max: number = 100): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  // 含最大值，含最小值
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * @function
 * @description 设置env参数，一般在main.js中调用
 * @param  {AnyObject} env 要设置的值
 */
export const setEnv = (env: AnyObject) => {
  ENV = env
}
/**
 * @function
 * @description 获取env参数
 * @param  {string} key 要获取的值
 * @returns {string} 获取的值
 */
export const getEnv = (key: string): string => {
  return safeData(ENV, key, '')
}

/**
 * @function
 * @description 设置object参数,可做运行时缓存
 * @param  {string} key 要设置的key
 * @param  {AnyObject} data 要设置的值
 * @returns {AnyObject}
 */
export const setObj = (key: string, data: AnyObject): AnyObject => {
  if (!key) {
    DATA_OBJECT = data
  } else {
    DATA_OBJECT[key] = data
  }
  return DATA_OBJECT
}

/**
 * @function
 * @description 获取object参数
 * @param  {string} key 要获取的值
 * @param  {string} argData 要合并的值
 * @param  {boolean} isDeepCopy 是否深拷贝
 * @returns {AnyObject} 获取的值
 */
export const getObj = (
  key: string,
  argData?: AnyObject,
  isDeepCopy?: Bool
): AnyObject => {
  let res: AnyObject = safeData(DATA_OBJECT, key, {})
  if (argData) {
    res = Object.assign(res, argData)
  }
  if (!isDeepCopy) {
    return res
  } else {
    return JSON.parse(JSON.stringify(res))
  }
}

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
export const setLog = (
  logLevel: string | number = 4,
  logConfig: AnyObject = { error: 0 }
) => {
  // 1 error 2 warn 3 info 4 log 5 debug
  logLevel = logLevel || getEnv('VUE_APP_LOG_LEVEL') || 4
  const logList = ['log', 'info', 'warn', 'error']
  const log: AnyObject = {}
  logList.forEach((v) => {
    log[v] = (console as AnyObject)[v]
  })
  for (let key in logConfig) {
    if ((console as AnyObject)[key]) {
      ;(console as AnyObject)[key] = (...arg: any[]) => {
        const line = safeData(Error(), 'stack', [])?.split('\n')[2] || ''
        ;(log as AnyObject)[key](...arg, 'line>>' + line)
        // 回调处理
        typeof logConfig[key] === 'function' && logConfig[key](...arg, line)
      }
    }
  }
  switch (+logLevel) {
    case 1:
      console.warn = () => {}
    case 2:
      console.info = () => {}
    case 3:
      console.log = () => {}
    case 4:
      console.debug = () => {}
    default:
      break
  }
  // return log
}

/**
 * @function
 * @description深拷贝函数
 * @param obj 需要拷贝的对象
 * @returns 拷贝后的对象
 */
export const deepCopy = (obj: any, hash = new WeakMap()): any => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Map) return new Map(deepCopy(Array.from(obj), hash))
  if (obj instanceof Set) return new Set(deepCopy(Array.from(obj), hash))
  if (hash.has(obj)) return hash.get(obj)

  const copy = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj))
  hash.set(obj, copy)

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy(obj[key], hash)
    }
  }
  return copy
}

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
export const requestDeviceMotionPermission = () => {
  if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
    return (DeviceMotionEvent as any)
      .requestPermission()
      .then((permissionState: string) => {
        if (permissionState === 'granted') {
          return true
        } else {
          return false
        }
      })
      .catch(() => {
        return false
      })
  } else {
    return true
  }
}

/**
 * @function
 * @description 自动播放音频并返回音频元素。
 * @param {string} audioUrl - 音频地址
 * @param {boolean} isWeixin - 是否在微信中
 * @returns {HTMLAudioElement} - 音频元素
 */
export const autoPlayAudio = (
  audioUrl: string,
  isWeixin: boolean
): HTMLAudioElement => {
  const audio = new Audio(audioUrl)
  audio.addEventListener(
    'ended',
    function () {
      this.currentTime = 0
      this.play()
    },
    false
  )
  audio.autoplay = true
  if (isWeixin) {
    document.addEventListener(
      'WeixinJSBridgeReady',
      function () {
        audio.play()
      },
      false
    )
  }
  return audio
}

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
export const debounce = function (func: Function, delay: number) {
  let timeoutIdMap = new Map<string, any>()
  return function (...args: any[]) {
    // @ts-ignore
    const context = this
    const key = JSON.stringify(args)

    clearTimeout(timeoutIdMap.get(key))

    const timeoutId = setTimeout(() => {
      func.apply(context, args)
      timeoutIdMap.delete(key)
    }, delay)
    timeoutIdMap.set(key, timeoutId)
  }
}

/**
 * @function
 * @description 添加事件绑定
 * @param {Element} el - 绑定元素
 * @param {string} event - 事件名称
 * @param {function} handler - 事件处理函数
 */
export const on = (function () {
  if (typeof globalThis.document?.addEventListener === 'function') {
    return function (el: any, event: string, handler: any) {
      if (el && event && handler) {
        el.addEventListener(event, handler, false)
      }
    }
  }
  return function (el: any, event: string, handler: any) {
    if (el && event && handler) {
      el.attachEvent('on' + event, handler)
    }
  }
})()

/**
 * @function
 * @description 移除事件绑定
 * @param {Element} el - 绑定元素
 * @param {string} event - 事件名称
 * @param {function} handler - 事件处理函数
 */
export const off = (function () {
  if (typeof globalThis.document?.removeEventListener === 'function') {
    return function (el: any, event: string, handler: any) {
      if (el && event) {
        el.removeEventListener(event, handler, false)
      }
    }
  }
  return function (el: any, event: string, handler: any) {
    if (el && event) {
      el.detachEvent('on' + event, handler)
    }
  }
})()
