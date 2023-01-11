/**
 * @module
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description base64加解密
 */

import { encode as en, decode as de } from 'js-base64'
/**
 * @function
 * @description base64 加密
 * @param {string | number} argData 待加密内容
 * @returns {string} 已加密内容
 */
export const enBase64 = (argData: string | number): string => {
  argData = argData || ''
  var base64 = en(argData.toString())
  return base64
}
/**
 * @function
 * @description base64 解密
 * @param {string} argData 待解密内容
 * @returns {string} 已解密内容
 */
export const deBase64 = (argData: string): string => {
  try {
    argData = argData || ''
    var base64 = de(argData)
    return base64
  } catch {
    return ''
  }
}
/**
 * @function
 * @description 加密
 * @param {string | number} argData 待加密内容
 * @param {string} argType 加密类型，默认base64
 * @returns {string} 已加密内容
 */
export const encode = (
  argData: string | number,
  argType: string = 'base64'
): string => {
  switch (argType) {
    case 'base64':
      return enBase64(argData)
    default:
      return argData.toString()
  }
}

/**
 * @function
 * @description 解密
 * @param {string} argData 待解密内容
 * @param {string} argType 解密类型，默认base64
 * @returns {string} 已解密内容
 */
export const decode = (argData: string, argType: string = 'base64'): string => {
  switch (argType) {
    case 'base64':
      return deBase64(argData)
    default:
      return argData
  }
}
