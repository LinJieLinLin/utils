/*
 * @Author: linj
 * @Email: 993353454@qq.com
 * @Date: 2020-07-27 14:18:47
 * @Description:
 */
import { Base64 } from 'js-base64'
/**
 * @function
 * @description base64 加密
 * @param {string} argData 待加密内容
 * @returns {string} 已加密内容
 */
export const enBase64 = (argData) => {
  argData = argData || ''
  var base64 = Base64.encode(argData)
  return base64
}
/**
 * @function
 * @description base64 解密
 * @param {string} argData 待解密内容
 * @returns {string} 已解密内容
 */
export const deBase64 = (argData) => {
  try {
    argData = argData || ''
    var base64 = Base64.decode(argData)
    return base64
  } catch (e) {
    console.error('解密失败：', argData)
    return ''
  }
}
/**
 * @function
 * @description 加密
 * @param {string} argData 待加密内容
 * @param {string} argType 加密类型，默认base64
 * @returns {string} 已加密内容
 */
export const encode = (argData, argType = 'base64') => {
  switch (argType) {
    case 'base64':
      return enBase64(argData)
    case 'aes':
      return argData
  }
}

/**
 * @function
 * @description 解密
 * @param {string} argData 待解密内容
 * @param {string} argType 解密类型，默认base64
 * @returns {string} 已解密内容
 */
export const decode = (argData, argType = 'base64') => {
  switch (argType) {
    case 'base64':
      return deBase64(argData)
    case 'aes':
      return argData
  }
}
