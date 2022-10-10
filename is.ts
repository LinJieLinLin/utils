/**
 * @module index
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 判断函数
 */
/**
 * @function
 * @description 判断质数
 * @param {number} argValue 要判断的数据
 * @returns {boolean} 结果
 */
export const isPrime = (argValue: number): boolean =>
  !/^.?$|^(..+?)\1+$/.test('.'.repeat(argValue))

/**
 * @function
 * @description 判断是否是JSON
 * @param  {any} argData 数据
 * @returns {boolean}
 */
export const isJson = (argData: any): boolean => {
  try {
    return typeof JSON.parse(argData || '') === 'object'
  } catch (e) {}
  return false
}
/**
 * @function
 * @description 判断是否是Blob
 * @param  {any} argData 数据
 * @returns {boolean}
 */
export const isBlob = (argData: any): boolean => {
  return argData instanceof Blob
}

/**
 * @function
 * @description 判断是否是File
 * @param  {any} argData 数据
 * @returns {boolean}
 */
export const isFile = (argData: any): boolean => {
  return argData instanceof File
}

/**
 * @function
 * @description 是否为正确的身份证号码
 * @param  {string} code 身份证号码
 * @returns {boolean}
 */
export const isIdCard = (code: string): boolean => {
  let tip = ''
  let city: { [key: number]: string } = {
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
  let pass = true
  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      code
    )
  ) {
    tip = '身份证号格式错误'
    pass = false
  } else if (!city[+code.substring(0, 2)]) {
    tip = '地址编码错误'
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      const codeArr = code.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      let sum = 0
      let ai = 0
      let wi = 0
      for (let i = 0; i < 17; i++) {
        ai = Number(codeArr[i])
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
  console.assert(!tip, tip)
  return pass
}
