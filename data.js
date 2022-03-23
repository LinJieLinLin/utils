/**
 * 类字符串/参数处理
 * @module index
 * @author linj
 */
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
  const temKey = argCheck.toString().split('.')
  const temLen = temKey.length
  if (!argData) {
    return argValue
  }
  if (temLen > 1) {
    for (let i = 0; i < temLen - 1; i++) {
      if (typeof argData[temKey[i]] !== 'object') {
        if (argSetValueForce) {
          console.error('赋值失败：', argData, i)
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
 * 描述
 * @function
 * @description toFixed处理
 * @date 2020-03-01
 * @param {any} argData 要处理的数据
 * @param {number} argNum 要保留位数,默认返回2位小数
 * @param {string} argType 返回类型，默认返回字符串
 * @returns {any} 返回处理好的数据
 */
export const toFixed = (argData, argNum = 2, argType = 'string') => {
  if (isNaN(argData)) {
    return argType === 'string' ? '' : 0
  }
  let data = Math.round(argData * Math.pow(10, argNum)) / Math.pow(10, argNum)
  data = (+argData).toFixed(argNum)
  return argType === 'string' ? data : +data
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
 * 描述
 * @function
 * @description 10进制转62进制,用于短网址转换
 * @date 2020-03-01
 * @param {number} argData 要处理的数据
 * @returns {string} 返回处理好的数据
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
 * @description 62进制转10进制,用于短网址转换
 * @date 2020-03-01
 * @param {string} argData 要处理的数据
 * @returns {number} 返回处理好的数据
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
export const getUrlParam = (
  argName,
  argUrl = globalThis.location.search || ''
) => {
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
  argData = globalThis.location.search || globalThis.location.hash
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
export const replaceUrlParam = (
  name,
  value,
  url = globalThis.location.href || ''
) => {
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
 * 描述
 * @function
 * @description 数据中间加星号
 * @param {string} argData 要处理的数据
 * @param {number} argStart=3 前端显示多少位
 * @param {number} argEnd=4 后面显示多少位
 * @returns {string} 返回处理好的数据
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
export const getUuid = () => {
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
 */
export const randomInt = (min = 0, max = 100) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  // 含最大值，含最小值
  return Math.floor(Math.random() * (max - min + 1)) + min
}
