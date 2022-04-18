/**
 * 类字符串/参数处理
 * @module index
 * @author linj
 */

import { getStorage } from './base'

let ENV: AnyObject = {}
/**
 * @function
 * @description 数据安全访问
 * @param  {any} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {any} argValue [如果数据有误，返回的值，选填]
 * @param  {boolean|0|1} argSetValueForce [是否强制赋值argValue]
 * @returns {any}
 */
export const safeData = (
  argData: any,
  argCheck: string,
  argValue?: any,
  argSetValueForce?: boolean | 0 | 1
): any => {
  if (typeof argCheck !== 'string' && typeof argCheck !== 'number') {
    console.error('argCheck请传入string当前为:' + argCheck)
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
          // console.error('赋值失败：', argData, i)
        }
        return argValue
      }
      argData = argData[temKey[i]] || {}
    }
  }
  if (argSetValueForce) {
    argData[temKey[temLen - 1]] = argValue
  }
  if (typeof argValue === 'undefined') {
    return argData[temKey[temLen - 1]]
  } else {
    return argData[temKey[temLen - 1]] || argValue
  }
}
/**
 * 描述
 * @function
 * @description toFixed处理
 * @date 2020-03-01
 * @param {string|number} argData 要处理的数据
 * @param {number} argNum 要保留位数,默认返回2位小数
 * @param {string} argType 返回类型，默认返回字符串
 * @returns {string|number} 返回处理好的数据
 */
export const toFixed = (
  argData: string | number,
  argNum: number = 2,
  argType: string = 'string'
): string | number => {
  let data: number | string =
    Math.round(+argData * Math.pow(10, argNum)) / Math.pow(10, argNum)
  data = (+data || 0).toFixed(argNum)
  return argType === 'string' ? data : +data
}
/**
 * @function
 * @description 驼峰转下划线
 * @param {string} argData 要转换数据
 * @param {string} argUnit 要转换的字符，默认“_”
 * @return {string}
 */
export const toLine = (argData: string, argUnit: string = '_'): string => {
  return argData.replace(/([A-Z])/g, argUnit + '$1').toLowerCase()
}

/**
 * @function
 * @description 下划线转驼峰
 * @param {string} argData 要转换数据
 * @param {string} argUnit 要转换的字符，默认“_”
 * @return {string}
 */
export const toHump = (argData: string, argUnit: string = '_'): string => {
  return argData.replace(
    new RegExp('\\' + argUnit + '(\\w)', 'g'),
    (_, letter) => {
      return letter.toUpperCase()
    }
  )
}
/**
 * 描述
 * @function
 * @description 10进制转62进制,用于短网址转换
 * @date 2020-03-01
 * @param {number|string} argData 要处理的数据
 * @returns {string} 返回处理好的数据
 */
export const string10to62 = (argData: number | string): string => {
  let chars =
    '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('')
  let radix = chars.length
  let data = +argData
  let arr = []
  do {
    let mod = data % radix
    data = (data - mod) / radix
    arr.unshift(chars[mod])
  } while (data)
  return arr.join('')
}
/**
 * 描述
 * @function
 * @description 62进制转10进制,用于短网址转换
 * @date 2020-03-01
 * @param {string} argData 要处理的数据
 * @returns {number} 返回处理好的数据
 */
export const string62to10 = (argData: string): number => {
  let chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'
  let radix = chars.length
  let len = argData.length
  let i = 0
  let resNum = 0
  while (i < len) {
    resNum +=
      Math.pow(radix, i++) * chars.indexOf(argData.charAt(len - i) || '0')
  }
  return resNum
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
): any => {
  const res: any = {}
  try {
    argData = decodeURIComponent(argData)
    let temArr = argData.split('?')
    argData = temArr.pop() || ''
    argData.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, key: string, value) => {
      res[key] = value
      return ''
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
  let reg = new RegExp('([?]|&)(' + name + '=)([^&#]*)([&]?|$)', 'img')
  let r = url.match(reg)
  let search = url.split('?')
  let strValue: string = url
  if (value === undefined || value === null) {
    if (r != null) {
      strValue = url.replace(reg, function () {
        if (!arguments[4] || !arguments[4].length) {
          return ''
        } else if (arguments[1] === arguments[4]) {
          return arguments[1]
        }
        return arguments[1] + arguments[4]
      })
      strValue = strValue.replace('?&', '?')
    }
  } else if (r != null) {
    strValue = url.replace(reg, `$1$2${value}$4`)
  } else if (search.length > 1) {
    let sub = search[1].split('#')
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
    let sub = url.split('#')
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
 * @description 转义html标签
 * @param  {string} argHtml 需要转义的文本
 * @returns {string}
 */
export const encodeHtml = (argHtml: string): string => {
  if (!argHtml || argHtml.length === 0) {
    return ''
  }
  argHtml = argHtml.replace(/&/g, '&amp;')
  argHtml = argHtml.replace(/</g, '&lt;')
  argHtml = argHtml.replace(/>/g, '&gt;')
  argHtml = argHtml.replace(/'/g, '&#39;')
  argHtml = argHtml.replace(/"/g, '&quot;')
  argHtml = argHtml.replace(/ /g, '&nbsp;')
  argHtml = argHtml.replace(/\n/g, '<br>')
  return argHtml
}

/**
 * @function
 * @description 反转义html标签
 * @param  {string} argHtml 需要反转义的文本
 * @returns {string}
 */
export const decodeHtml = (argHtml: string): string => {
  if (!argHtml || argHtml.length === 0) {
    return ''
  }
  argHtml = argHtml.replace(/&amp;/g, '&')
  argHtml = argHtml.replace(/&lt;/g, '<')
  argHtml = argHtml.replace(/&gt;/g, '>')
  argHtml = argHtml.replace(/&#39;/g, "'")
  argHtml = argHtml.replace(/&quot;/g, '"')
  argHtml = argHtml.replace(/&nbsp;/g, ' ')
  argHtml = argHtml.replace(/<br>/g, '\n')
  return argHtml
}
/**
 * 描述
 * @function
 * @description 数据中间加星号
 * @param {string|number} argData 要处理的数据
 * @param {number} argStart=3 前端显示多少位
 * @param {number} argEnd=4 后面显示多少位
 * @returns {string} 返回处理好的数据
 */
export const hideInfo = (
  argData: string | number = '',
  argStart: number = 3,
  argEnd: number = 4
): string => {
  argData = String(argData)
  let temLen = argData.length
  let temSL = argData.length - argEnd - argStart
  let start = ''
  if (temSL > 0) {
    for (let i = 0; i < temSL; i++) {
      start += '*'
    }
    argData =
      argData.substring(0, argStart) +
      start +
      argData.substring(temLen - argEnd, temLen)
  }
  return argData
}
/**
 * @function
 * @description 获取简单uuid
 * @returns {string} uuid
 */
export const getUuid = (): string => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
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
 * @description 设置日志输出logLevel 1 error 2 warn 3 info 4 debug
 * @param {AnyObject} logConfig 重写配置
 * @param {function} logConfig.error 错误日志回调（做额外处理用）
 */
export const setLog = (logConfig?: AnyObject) => {
  // logLevel 1 error 2 warn 3 info 4 debug
  const logLevel = +getStorage('logLevel') || getEnv('VUE_APP_LOG_LEVEL')
  const logList = ['log', 'info', 'warn', 'error']
  const log: AnyObject = {}
  logList.forEach((v) => {
    log[v] = (console as AnyObject)[v]
  })
  for (let key in logConfig) {
    if ((console as AnyObject)[key]) {
      ;(console as AnyObject)[key] = (...arg: any[]) => {
        ;(log as AnyObject)[key](...arg, Error().stack?.split('\n')[2])
        // 回调处理
        logConfig[key] && logConfig[key](...arg, Error().stack?.split('\n')[2])
      }
    }
  }
  switch (logLevel) {
    case 1:
      console.warn = () => {}
    case 2:
      console.info = () => {}
    case 3:
      console.log = () => {}
    default:
      break
  }
  // return log
}
