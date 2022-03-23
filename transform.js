/**
 * 类型转换相关处理
 * @module index
 * @author linj
 */

import { toFixed } from './data'

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
  const fmtMap = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }
  const week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d',
  }
  const temY = fmt.match(/(Y+)/)
  if (temY) {
    fmt = fmt.replace(
      temY[0],
      (date.getFullYear() + '').substring(4 - temY[0].length)
    )
  }
  const temWeek = fmt.match(/(E+)/)
  if (temWeek) {
    const temWeekName = ['', '\u5468']
    fmt = fmt.replace(
      temWeek[0],
      (temWeekName[temWeek[0].length] || '\u661f\u671f') +
        week[date.getDay() + '']
    )
  }
  for (var k in fmtMap) {
    let temMatch = fmt.match(new RegExp('(' + k + ')'))
    if (temMatch) {
      fmt = fmt.replace(
        temMatch[0],
        temMatch[0].length === 1
          ? fmtMap[k]
          : ('00' + fmtMap[k]).substring(('' + fmtMap[k]).length)
      )
    }
  }
  return fmt
}

/**
 * @description 日期格式化友好显示 刚刚 x分钟前 ...，超过一年的按 fmt来格式化
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
    // console.error('not a valid date')
    return '--'
  }
  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 365) {
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
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + '周前') ||
    (dayDiff < 365 && Math.ceil(dayDiff / 31) + '月前')
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
  return +((100 / argWith) * argPx).toFixed(argNum) + argUnit
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
      size: 12,
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
  argRate = 1024,
  unit = ['B', 'K', 'M', 'G', 'T', 'P']
) => {
  let list = unit
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
