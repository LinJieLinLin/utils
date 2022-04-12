/**
 * 类型转换相关处理
 * @module index
 * @author linj
 */

import { toFixed } from './data'
import { safeData } from './data'

/**
 * @function
 * @description 显示人民币价格
 * @param  {unknown} argData 价格
 * @param  {number} argRate -1 保留多少位小数
 * @param  {string} argUnit ￥ 单位
 * @param  {string} argDef 空数据默认值
 * @returns {string} eg: ￥100
 */
export const rmbPrice = (
  argData: unknown,
  argRate: number = -1,
  argUnit: string = '￥',
  argDef: string = '--'
): string => {
  if (typeof argData === 'string' || typeof argData === 'number') {
    if (!argData && argData !== 0) {
      return argDef
    }
  } else {
    return argDef
  }
  argData = Number(argData)
  if (argRate > -1) {
    argData = +toFixed(argData as number, argRate)
  }
  return argUnit + argData
}

/**
 * @description 日期格式化显示
 * @function
 * @param  {string|number} date 时间对象\时间戳，默认当前时间
 * @param  {string} fmt 格式化符串，默认'YYYY-MM-DD HH:mm:ss' E为星期数，EEE:星期一 q为季度，S为毫秒数
 * @param  {string} emptyTip date为false时，默认''
 * @returns {string}
 */
export const formatTime = (
  date: string | number | Date = +new Date(),
  fmt: string = 'YYYY-MM-DD HH:mm:ss',
  emptyTip: string = ''
): string => {
  if (!date && date !== 0) {
    return emptyTip
  }
  if (isNaN(+date)) {
    return emptyTip
  }
  if (typeof date === 'number') {
    if (date.toString().length === 10) {
      date = date * 1000
    }
  }
  date = new Date(+date)
  const fmtMap: { [key: string]: number } = {
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
        safeData(week, date.getDay().toString(), '')
    )
  }
  for (let k in fmtMap) {
    let temMatch = fmt.match(new RegExp('(' + k + ')'))
    if (temMatch) {
      fmt = fmt.replace(
        temMatch[0],
        temMatch[0].length === 1
          ? fmtMap[k].toString()
          : ('00' + fmtMap[k].toString()).substring(('' + fmtMap[k]).length)
      )
    }
  }
  return fmt
}

/**
 * @description 日期格式化友好显示 刚刚 x分钟前 ...，超过一年的按 fmt来格式化
 * @function
 * @param  {string|number|Date} date 时间对象\时间戳，默认当前时间
 * @param  {string} fmt 格式化符串，默认'YYYY-MM-DD HH:mm:ss'
 * @param  {string} emptyTip date为false时，默认''
 * @returns {string}
 */
export const friendlyTime = (
  date: string | number | Date = +new Date(),
  fmt: string = 'YYYY-MM-DD HH:mm:ss',
  emptyTip: string = ''
): string => {
  if (!date && date !== 0) {
    return emptyTip
  }
  if (isNaN(+date)) {
    return emptyTip
  }
  if (typeof date === 'number') {
    if (date.toString().length === 10) {
      date = date * 1000
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
    return emptyTip || '--'
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
  ).toString()
}
/**
 * @function
 * @description px转vw
 * @param {number} argPx px
 * @param {number} argWith px对应最大宽度
 * @param {number} argNum 保留小数
 * @param {string} argUnit 单位 'vw'||'%'
 * @return {string}
 */
export const px2vw = (
  argPx: number,
  argWith: number = 375,
  argNum: number = 6,
  argUnit: string = 'vw'
): string => {
  return +toFixed((100 / argWith) * argPx, argNum) + argUnit
}
/**
 * @function
 * @description 秒转倒计时
 * @param {number} argData 秒数
 * @param {string} argType 's,m,h,d,M,y 对应 秒 分 时 天 月 年'
 * @param {object} argOption 额外的处理argOption.unit 单位['年', '月', '天', '时', '分', '秒']
 * @returns {string}
 */
export const secondToTime = (
  argData: number,
  argType: string = 'y',
  argOption: { unit?: string[] } = {}
): string => {
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
  let unitList = argOption?.unit || ['年', '月', '天', '时', '分', '秒']
  let index = 0
  for (let i = 0; i < temLen; i++) {
    let lastSize = size
    if (argType === list[i].type) {
      let temTime: number | string = Math.floor(second / lastSize)
      if (temTime < 10) {
        temTime = '0' + temTime
      }
      res.unshift(temTime)
      index = temLen - i - 1
      break
    }
    size = size * list[i + 1].size
    let time: number | string = Math.floor((second % size) / lastSize)
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
 * @param {number} argData byte数据
 * @param {number} argNum 保留小数位
 * @param {number} argIndex 起始单位偏移eg: 0:b 1:k 2:m
 * @param {number} argRate 进制
 * @param {string[]} unit 进制
 * @returns {string} 计算结果
 */
export const formatSize = (
  argData: number,
  argNum: number = 2,
  argIndex: number = 0,
  argRate: number = 1024,
  unit: string[] = ['B', 'K', 'M', 'G', 'T', 'P']
): string => {
  let list = unit
  if (!argData) {
    return '0' + list[argIndex]
  }
  let len = list.length
  let nowIndex = len - 1
  let temData: number = 0
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
 * @param {number} argData 数据
 * @param {number} argNum 保留小数位
 * @returns {string} 计算结果
 */
export const formatNumber = (argData: number, argNum: number = 2): string => {
  if (argData < 1000) {
    return argData.toString()
  } else if (argData < 10000) {
    return toFixed(argData / 1000, argNum, 'number') + 'k'
  } else {
    return toFixed(argData / 10000, argNum, 'number') + 'w'
  }
}
