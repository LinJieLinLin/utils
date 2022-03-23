import { safeData } from './data'
import { isJson } from './is'

/**
 * 公共函数
 * @module
 * @author linj
 * @description 公共函数
 */
let isOnline = true
// #ifdef H5
// 断网监听
if (globalThis && globalThis.addEventListener) {
  globalThis.addEventListener('offline', function () {
    // console.log('offLine')
    isOnline = false
  })
  globalThis.addEventListener('online', function () {
    // console.log('onLine')
    isOnline = true
  })
}
// #endif
/**
 * @function
 * @description 获取当前网络状态（H5）
 * @return boolean
 */
export const getNetworkStatus = () => {
  return isOnline
}
/**
 * @function
 * @description 正则收集
 * @returns {object}
 */
export const getRegexp = () => {
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
    email: /^(w)+(.w+)*@(w)+((.w+)+)$/,
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
  }
}

/**
 * @function
 * @description 设置标题
 * @param  {} argTitle 标题
 */
export const setTitle = (argTitle) => {
  globalThis.document.getElementsByTagName('title')[0].innerText = argTitle
}
/**
 * @function
 * @description 使用postcss-px2rem时使用
 * @param {int} argBaseSize 基础大小 16px（要跟配置一致） argWidth 基础宽度
 */
export const remInit = (argBaseSize = 16, argWidth = 375) => {
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
 */
export const getCookie = (argName) => {
  let cookie = globalThis.document.cookie.split('; ')
  for (let i = 0; i < cookie.length; i += 1) {
    let name = ('' + cookie[i]).split('=')
    if (argName === name[0]) {
      return decodeURIComponent(name[1] || '')
    }
  }
  return ''
}
/**
 * @function
 * @description 设置cookie
 * @param  {string} argName 要设置的值
 * @param  {string} argName 要设置的key
 * @param  {string} argValue 要设置的value
 * @param  {string} argTime 过期时间/时 默认24小时
 */
export const setCookie = (argName, argValue = '', argTime = 24) => {
  if (typeof argName !== 'string') {
    return
  }
  let now = new Date()
  let offset = 8
  let utc = now.getTime() + now.getTimezoneOffset() * 60000
  let nd = utc + 3600000 * offset
  let exp = new Date(nd)
  let domain = globalThis.document.domain
  exp.setTime(exp.getTime() + argTime * 60 * 60 * 1000)
  globalThis.document.cookie =
    argName +
    '=' +
    encodeURIComponent(argValue) +
    ';path=/;expires=' +
    exp.toGMTString() +
    ';domain=' +
    domain +
    ';'
}
/**
 * @function
 * @description 清除cookie
 * @param  {string} argName 要清除的值
 */
export const delCookie = (argName = '') => {
  setCookie(argName, '', -1)
}

/**
 * @function
 * @description 检测浏览器状态，系统状态 *
 * @returns {object} {
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
export const getInfo = () => {
  let info = {}
  let ua = globalThis.navigator.userAgent.toLowerCase()
  let platform = safeData(
    globalThis.navigator,
    'userAgentData.platform',
    ''
  ).toLowerCase()
  info = {
    ua: ua,
    platform: platform,
    isMobile: ua.match(/mobile/) && true,
    isWin: platform.match('win') && true,
    isIphone: ua.match(/iphone/) && true,
    isIpad: ua.match(/ipad/) && true,
    isMac: platform.match('mac') && true,
    isIos: platform.match('ios') && true,
    isAndroid: platform.match('android') && true,
    isSafari: ua.indexOf('safari') > -1 && ua.indexOf('chrome') < 1,
    isIE: !!globalThis.ActiveXObject || 'ActiveXObject' in globalThis,
  }
  if (info.ua.match('msie')) {
    let IE = info.ua.match(/msie\s([0-9]*)/)
    if (IE.length >= 2) {
      info.isIe = IE[1]
    }
  }
  info.isAppleMobile =
    info.isMobile &&
    ua.toLowerCase().indexOf('applewebkit') &&
    ua.indexOf('chrome') < 1
  info = Object.assign({}, globalThis.navigator, info)
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
export const getStorage = (argKey, argNoJson) => {
  let res = globalThis.localStorage.getItem(argKey)
  // 默认转义JSON字符串
  if (!argNoJson && isJson(res)) {
    res = JSON.parse(res)
  }
  return res || ''
}

/**
 * @function
 * @description 设置storage的值，默认将obj转为json
 * @param {string} argKey 要获取的key
 * @param {object} argData
 * @returns {any} 保存的数据
 */
export const setStorage = (argKey, argData) => {
  if (typeof argData === 'object') {
    argData = JSON.stringify(argData)
  }
  globalThis.localStorage.setItem(argKey, argData)
  return argData
}

/**
 * @function
 * @description setTimeout promise版
 * @param  {number} ms 时间，毫秒
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
