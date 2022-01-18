/**
 * 公共函数
 * @module
 * @author linj
 * @description 公共函数
 */

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
 * @description 数据安全访问
 * @param  {object|Array} argData  [原始数据]
 * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
 * @param  {*} argValue [如果数据有误，返回的值，选填]
 * @param  {Boolean} argSetValueForce [是否强制赋值argValue]
 * @returns {any}
 */
export const safeData = (argData, argCheck, argValue, argSetValueForce) => {
  if (typeof argCheck !== 'string' && typeof argCheck !== 'number') {
    console.error('argCheck请传入string当前为：' + argCheck)
    return ''
  }
  var temKey = argCheck.toString().split('.')
  var temLen = temKey.length
  if (!argData) {
    return argValue
  }
  if (temLen > 1) {
    for (var i = 0; i < temLen - 1; i++) {
      if (typeof argData[temKey[i]] !== 'object') {
        if (argSetValueForce) {
          console.error('赋值失败：', argData)
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
  }
  return argData[temKey[temLen - 1]] || argValue
}
/**
 * @description obj转url参数
 * @function
 * @param {object} argParams 参数对象
 * @param {boolean} noMark 默认带?,true时,不带
 * @returns {string}
 */
export const setUrlParams = (argParams, noMark) => {
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
export const getUrlParam = (argName, argUrl = window.location.search) => {
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
 * @returns {object}
 */
export const getUrlParamObj = (
  argData = window.location.search || window.location.hash
) => {
  const res = {}
  try {
    argData = decodeURIComponent(argData)
    let temArr = argData.split('?')
    argData = temArr.pop()
    argData.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, key, value) => {
      res[key] = value
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
 * @param  {} name key
 * @param  {} value 要替换的value
 * @param  {} url 要替换的网址,默认location.href
 */
export const replaceUrlParam = (name, value, url = window.location.href) => {
  let reg = new RegExp('([?]|&)(' + name + '=)([^&#]*)([&]?|$)', 'img')
  let r = url.match(reg)
  let search = url.split('?')
  let strValue = url
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
 * @param  {} argHtml 需要转义的文本
 */
export const encodeHtml = (argHtml) => {
  if (!argHtml || argHtml.length === 0) {
    return ''
  }
  argHtml = argHtml.replace(/&/g, '&amp;')
  argHtml = argHtml.replace(/</g, '&lt;')
  argHtml = argHtml.replace(/>/g, '&gt;')
  argHtml = argHtml.replace(/ /g, '&nbsp;')
  argHtml = argHtml.replace(/'/g, '&#39;')
  argHtml = argHtml.replace(/"/g, '&quot;')
  argHtml = argHtml.replace(/\n/g, '<br>')
  return argHtml
}

/**
 * @function
 * @description 反转义html标签
 * @param  {} argHtml 需要反转义的文本
 */
export const decodeHtml = (argHtml) => {
  if (!argHtml || argHtml.length === 0) {
    return ''
  }
  argHtml = argHtml.replace(/&amp;/g, '&')
  argHtml = argHtml.replace(/&lt;/g, '<')
  argHtml = argHtml.replace(/&gt;/g, '>')
  argHtml = argHtml.replace(/&nbsp;/g, ' ')
  argHtml = argHtml.replace(/&#39;/g, "'")
  argHtml = argHtml.replace(/&quot;/g, '"')
  argHtml = argHtml.replace(/<br>/g, '\n')
  return argHtml
}

/**
 * @function
 * @description 设置标题
 * @param  {} argTitle 标题
 */
export const setTitle = (argTitle) => {
  document.getElementsByTagName('title')[0].innerText = argTitle
}

/**
 * @function
 * @description 显示人民币价格
 * @param  {} argData 价格
 * @param  {} argRate=0 保留多少位小数
 * @returns {string} eg: ￥100
 */
export const rmbPrice = (argData, argRate = -1) => {
  if (typeof argData !== 'number') {
    return argData || '--'
  }
  if (argRate > -1) {
    argData = argData.toFixed(argRate)
  }
  return '￥' + argData
}

/**
 * @description 日期格式化显示
 * @function
 * @param  {number} date 时间对象\时间戳，默认当前时间
 * @param  {string} fmt 格式化符串，默认'YYYY-MM-DD HH:mm:ss' E为星期数，EEE:星期一 q为季度，S为毫秒数
 * @param  {string} emptyTip date为false时，默认''
 * @returns {string}
 */
export const formatTime = (
  date = +new Date(),
  fmt = 'YYYY-MM-DD HH:mm:ss',
  emptyTip = ''
) => {
  if (!date && date !== 0) {
    return emptyTip
  }
  if (typeof date === 'number') {
    date = '' + date
    if (date.length === 10) {
      date += '000'
    }
  }
  date = new Date(+date)
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }
  var week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d',
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[date.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

/**
 * @description 日期格式化友好显示 刚刚 x分钟前 ...，超过一个月的按 fmt来格式化
 * @function
 * @param  {number} date 时间对象\时间戳，默认当前时间
 * @param  {string} fmt 格式化符串，默认'YYYY-MM-DD HH:mm:ss'
 * @param  {string} emptyTip date为false时，默认''
 * @returns {string}
 */
export const friendlyTime = (
  date = +new Date(),
  fmt = 'YYYY-MM-DD HH:mm:ss',
  emptyTip = ''
) => {
  if (!date && date !== 0) {
    return emptyTip
  }
  if (typeof date === 'number') {
    date = '' + date
    if (date.length === 10) {
      date += '000'
    }
  }
  date = new Date(+date)
  let diff = (new Date().getTime() - date.getTime()) / 1000
  let dayDiff = Math.floor(diff / 86400)
  let isValidDate =
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date.getTime())
  if (!isValidDate) {
    console.error('not a valid date')
  }
  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return formatTime(date, fmt)
  }
  return (
    (dayDiff === 0 &&
      ((diff < 60 && '刚刚') ||
        (diff < 120 && '1分钟前') ||
        (diff < 3600 && Math.floor(diff / 60) + '分钟前') ||
        (diff < 7200 && '1小时前') ||
        (diff < 86400 && Math.floor(diff / 3600) + '小时前'))) ||
    (dayDiff === 1 && '昨天') ||
    (dayDiff < 7 && dayDiff + '天前') ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + '周前')
  )
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
    const scale = document.documentElement.clientWidth / argWidth
    // 设置页面根节点字体大小
    document.documentElement.style.fontSize = argBaseSize * scale + 'px'
  }
  // 初始化
  setRem()
  // 改变窗口大小时重新设置 rem
  window.onresize = () => {
    setRem()
  }
}

/**
 * @function
 * @description 是否为正确的身份证号码
 * @param  {string} code 身份证号码
 */
export const isIdCard = (code) => {
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
  }
  let tip = ''
  let pass = true
  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      code
    )
  ) {
    tip = '身份证号格式错误'
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    tip = '地址编码错误'
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      let sum = 0
      let ai = 0
      let wi = 0
      for (let i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      let last = parity[sum % 11] + ''
      if (last !== code[17]) {
        tip = '校验位错误'
        pass = false
      }
    }
  }
  console.log(tip)
  return pass
}
/**
 * @function
 * @description 获取cookie
 * @param  {string} argName 要获取的值
 */
export const getCookie = (argName) => {
  let cookie = document.cookie.split('; ')
  for (let i = 0; i < cookie.length; i += 1) {
    let name = cookie[i].split('=')
    if (argName === name[0]) {
      return unescape(name[1] || '')
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
export const setCookie = (argName, argValue, argTime = 24) => {
  let now = new Date()
  let offset = 8
  let utc = now.getTime() + now.getTimezoneOffset() * 60000
  let nd = utc + 3600000 * offset
  let exp = new Date(nd)
  let domain = document.domain
  exp.setTime(exp.getTime() + argTime * 60 * 60 * 1000)
  document.cookie =
    argName +
    '=' +
    escape(argValue) +
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
export const delCookie = (argName) => {
  setCookie(argName, '', -1)
}
/**
 * @function
 * @description setTimeout promise版
 * @param  {number} ms 时间，毫秒
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
/**
 * @function
 * @description 获取随机数,含最大值，含最小值
 * @param  {number} min 最小值
 * @param  {number} max 最大值
 */
export const randomInt = (min = 0, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  // 含最大值，含最小值
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * @function
 * @description 判断是否是JSON
 * @param  {any} argData 数据
 * @returns {boolean}
 */
export const isJson = (argData) => {
  try {
    if (typeof JSON.parse(argData || '') === 'object') {
      return true
    }
  } catch (e) { }
  return false
}
/**
 * @function
 * @description 判断是否是Blob
 * @param  {any} argData 数据
 * @returns {boolean}
 */
export const isBlob = (argData) => {
  return argData instanceof Blob
}
/**
 * @function
 * @description 判断是否是File
 * @param  {any} argData 数据
 * @returns {boolean}
 */
export const isFile = (argData) => {
  return argData instanceof File
}

/**
 * @function
 * @description 获取简单uuid
 * @returns {string} uuid
 */
export const uuid = () => {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + Date.now()
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
  let ua = navigator.userAgent.toLowerCase()
  let platform = safeData(
    navigator,
    'userAgentData.platform',
    navigator.platform
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
    isIE: !!window.ActiveXObject || 'ActiveXObject' in window,
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
  info = Object.assign({}, navigator, info)
  return info
}

/**
 * 描述
 * @function
 * @description 数据中间加星号
 * @date 2019-11-01
 * @param {any} argData 要处理的数据
 * @param {any} argStart=3 前端显示多少位
 * @param {any} argEnd=4 后面显示多少位
 * @returns {any} 返回处理好的数据
 */
export const hideInfo = (argData = '', argStart = 3, argEnd = 4) => {
  if (typeof argData !== 'string') {
    argData = argData.toString()
  }
  let temLen = argData.length
  let temSL = argData.length - argEnd - argStart
  let start = ''
  if (temSL > 0) {
    for (let i = 0; i < temSL; i++) {
      start += '*'
    }
    argData =
      argData.substr(0, argStart) +
      start +
      argData.substr(temLen - argEnd, temLen)
  }
  return argData
}

/**
 * 描述
 * @function
 * @description 10进制转62进制
 * @date 2020-03-01
 * @param {any} argData 要处理的数据
 * @returns {any} 返回处理好的数据
 */
export const string10to62 = (argData) => {
  var chars =
    '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('')
  var radix = chars.length
  var data = +argData
  var arr = []
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
 * @description 62进制转10进制
 * @date 2020-03-01
 * @param {any} argData 要处理的数据
 * @returns {any} 返回处理好的数据
 */
export const string62to10 = (argData) => {
  argData = String(argData)
  var chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'
  var radix = chars.length
  var len = argData.length
  var i = 0
  var resNum = 0
  while (i < len) {
    resNum += Math.pow(radix, i++) * chars.indexOf(argData.charAt(len - i) || 0)
  }
  return resNum
}
/**
 * 描述
 * @function
 * @description blob转base64
 * @date 2020-03-01
 * @param {any} argBlob 要处理的数据
 * @returns {any} 返回base64
 */
export const blobToBase64 = async (argBlob) => {
  // eslint-disable-next-line no-undef
  const fileReader = new FileReader()
  // readAsDataURL
  fileReader.readAsDataURL(argBlob)
  fileReader.onload = (e) => {
    return Promise.resolve(e.target.result)
  }
  fileReader.onerror = () => {
    return Promise.reject(new Error('文件流异常'))
  }
}
/**
 * 描述
 * @function
 * @description toFixed处理
 * @date 2020-03-01
 * @param {any} argData 要处理的数据
 * @param {any} argNum 要保留位数
 * @param {any} argType 返回类型，默认返回字符串
 * @returns {any} 返回处理好的数据
 */
export const toFixed = (argData, argNum = 2, argType = 'string') => {
  if (isNaN(argData)) {
    return argType === 'string' ? '' : 0
  }
  let data = (+argData).toFixed(argNum)
  return argType === 'string' ? data : +data
}
/**
 * 描述
 * @function
 * @description blobUrl 转 file文件
 * @date 2020-03-01
 * @param {any} argData blobUrl
 * @returns {any} 返回文件流
 */
export const blobUrlToFile = async (argData) => {
  return new Promise(function (resolve, reject) {
    // eslint-disable-next-line no-undef
    var xhr = new XMLHttpRequest()
    xhr.open('GET', argData, true)
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      if (this.status === 200) {
        return resolve(this.response)
      }
    }
    xhr.error = (err) => {
      return reject(err)
    }
    xhr.send()
  })
}
let isOnline = true
// #ifdef H5
// 断网监听
if (window && window.addEventListener) {
  window.addEventListener('online', function () {
    console.error('onLine')
    isOnline = true
  })
  window.addEventListener('offline', function () {
    console.error('offLine')
    isOnline = false
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
 * @description 图片dataUrl base64转blob对象
 * @param {string} argData dataUrl
 * @returns {blob}
 */
export const dataURLtoBlob = (argData) => {
  var arr = argData.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * @function
 * @description blob转file对象
 * @param {blob} argBlob blob对像
 * @param {string} argName filename
 * @returns {file}
 */
export const blobToFile = (argBlob, argName = Date.now()) => {
  let file = new File([argBlob], argBlob.name || argName, {
    type: argBlob.type,
  })
  return file
}
/**
 * @function
 * @description 下载文件
 * @param {type} argBlob blob对像/file对象/dataUrl/base64
 * @param {type} argName filename
 * @param {type} argDelTime 移除dateUrl时间
 */
export const dlFile = (argData, argName = Date.now(), argDelTime = 10000) => {
  let downNode = document.createElement('a')
  downNode.download = argName
  // 字符内容转换为blob地址
  let href = ''
  if (typeof argData === 'string') {
    if (argData.startsWith('blob:')) {
      href = argData
    } else if (argData.startsWith('data:image')) {
      href = argData
    }
    argData = new Blob([argData])
  }
  href = href || URL.createObjectURL(argData)
  downNode.href = href
  setTimeout(() => {
    URL.revokeObjectURL(href)
  }, argDelTime)
  document.body.appendChild(downNode)
  downNode.click()
  document.body.removeChild(downNode)
}

/**
 * @function
 * @description 动态加载html文件标签
 * @param {type} argUrl 要加载的url
 * @param {type} argType 加载类型 js/css
 * @param {type} argOptions{
 * disCheck:'不检查是否有相同标签'
 * force:'如果有相同标签，先删除再添加'
 * } 是否强制添加
 * @return promise
 */
export const loadFile = (argUrl, argType = 'js', argOptions = {}) => {
  let temId = argType + '-' + argUrl.split('/').pop()
  let head = document.getElementsByTagName('head')[0]
  let nodeTag = null
  if (!argOptions.disCheck) {
    let checkTag = document.getElementById(temId)
    // 已经存在对应tag
    if (checkTag) {
      if (argOptions.force) {
        head.removeChild(checkTag)
      } else {
        return { msg: '已存在，中断加载！' }
      }
    }
  }
  switch (argType) {
    case 'css':
      nodeTag = document.createElement('link')
      nodeTag.type = 'text/css'
      nodeTag.rel = 'stylesheet'
      nodeTag.href = argUrl
      break
    case 'js':
      nodeTag = document.createElement('script')
      nodeTag.src = argUrl
      nodeTag.type = 'text/javascript'
      break
    default:
      console.error('暂不支持：' + argType)
      return
  }
  nodeTag.id = temId
  head.appendChild(nodeTag)
  return new Promise((resolve) => {
    if (nodeTag.readyState) {
      nodeTag.onreadystatechange = function () {
        if (
          nodeTag.readyState === 'loaded' ||
          nodeTag.readyState === 'complete'
        ) {
          nodeTag.onreadystatechange = null
          return resolve(argUrl)
        }
      }
    } else {
      // Others
      nodeTag.onload = function () {
        console.log('已加载：' + argUrl)
        return resolve(argUrl)
      }
    }
  })
}

/**
 * @function
 * @description 获取随机颜色
 * @return string
 */
export const getRandomColor = function () {
  return (
    '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  )
}

/**
 * @function
 * @description px转vw
 * @param {type} argPx px
 * @param {type} argWith px对应最大宽度
 * @param {type} argNum 保留小数
 * @param {type} argUnit 单位 'vw'||'%'
 * @return:
 */
export const px2vw = (argPx, argWith = 375, argNum = 6, argUnit = 'vw') => {
  return ((100 / argWith) * argPx).toFixed(argNum) + argUnit
}

/**
 * @function
 * @description 驼峰转下划线
 * @param {string} argData 要转换数据
 * @param {string} argUnit 要转换的字符，默认“_”
 * @return {string}
 */
export const toLine = (argName, argData = '_') => {
  return argName.replace(/([A-Z])/g, argData + '$1').toLowerCase()
}

/**
 * @function
 * @description 下划线转驼峰
 * @param {string} argData 要转换数据
 * @param {string} argUnit 要转换的字符，默认“_”
 * @return {string}
 */
export const toHump = (argData, argUnit = '_') => {
  return argData.replace(
    new RegExp('\\' + argUnit + '(\\w)', 'g'),
    (all, letter) => {
      return letter.toUpperCase()
    }
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
  let res = localStorage.getItem(argKey)
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
  localStorage.setItem(argKey, argData)
  return argData
}
/**
 * @function
 * @description 秒转倒计时
 * @param {number} argData 秒数
 * @param {string} argType 's,m,h,d,M,y 对应 秒 分 时 天 月 年'
 * @param {object} argOption 额外的处理
 * @param {Array} argOption.unit 单位['年', '月', '天', '时', '分', '秒']
 * @returns {string} 保存的数据
 */
export const secondToTime = (argData, argType = 'y', argOption = {}) => {
  let res = []
  let list = [
    {
      size: 1,
      type: 's',
      unit: '',
      index: 0,
    },
    {
      size: 60,
      unit: ':',
      type: 'm',
      index: 1,
    },
    {
      size: 60,
      unit: ':',
      type: 'h',
      index: 2,
    },
    {
      size: 24,
      unit: ':',
      type: 'd',
      index: 3,
    },
    {
      size: 30,
      unit: ':',
      type: 'M',
      index: 4,
    },
    {
      size: 365,
      unit: ':',
      type: 'y',
      index: 5,
    },
  ]
  let temLen = list.length
  let second = argData
  let size = 1
  let unitList = argOption.unit || ['年', '月', '天', '时', '分', '秒']
  let index = 0
  for (let i = 0; i < temLen; i++) {
    let lastSize = size
    if (argType === list[i].type) {
      let temTime = Math.floor(second / lastSize)
      if (temTime < 10) {
        temTime = '0' + temTime
      }
      res.unshift(temTime)
      index = temLen - i - 1
      break
    }
    size = size * list[i + 1].size
    let time = Math.floor((second % size) / lastSize)
    if (time < 10) {
      time = '0' + time
    }
    res.unshift(time)
  }
  let timeText = ''
  let isZero = true
  res.map((v, k) => {
    if (!+v && isZero) {
      // console.error(v)
    } else {
      isZero = false
      timeText += v + unitList[index + k]
    }
  })
  return timeText
}
/**
 * @function
 * @description 容量单位转换
 * @param {object} argData byte数据
 * @param {string} argNum 保留小数位
 * @param {string} argIndex 起始单位偏移eg: 0:b 1:k 2:m
 * @param {string} argRate 进制
 * @returns {any} 计算结果
 */
export const formatSize = (
  argData,
  argNum = 2,
  argIndex = 0,
  argRate = 1024
) => {
  let list = ['B', 'K', 'M', 'G', 'T', 'P']
  if (!argData) {
    return '0' + list[argIndex]
  }
  let len = list.length
  let nowIndex = len - 1
  let temData
  for (let i = 0; i < len; i++) {
    temData = argData / Math.pow(argRate, i)
    if (temData < argRate) {
      nowIndex = argIndex + i
      break
    }
  }
  return toFixed(temData, argNum, 'number') + list[nowIndex]
}
/**
 * @function
 * @description 数量单位转换k/w
 * @param {object} argData 数据
 * @param {string} argNum 保留小数位
 * @returns {any} 计算结果
 */
export const formatNumber = (argData, argNum = 2) => {
  if (argData < 1000) {
    return argData
  } else if (argData < 10000) {
    return toFixed(argData / 1000, argNum, 'number') + 'k'
  } else {
    return toFixed(argData / 10000, argNum, 'number') + 'w'
  }
}

/**
 * @function
 * @description 获取音视频时长
 * @param {object} argFile 音视频数据，string时为链接
 * @returns {number} 时长
 */
export const getDuration = async (argFile) => {
  let filePath
  if (typeof argFile === 'string') {
    filePath = argFile
  } else {
    filePath = URL.createObjectURL(argFile)
  }
  return new Promise((resolve) => {
    const audio = new Audio(filePath)
    audio.addEventListener('loadedmetadata', function (e) {
      if (filePath.startsWith('blob:')) {
        URL.revokeObjectURL(filePath)
      }
      const duration = audio.duration
      audio.src = ''
      return resolve(duration)
    })
  })
}
