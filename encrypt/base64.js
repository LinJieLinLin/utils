/**
 * @module
 * @author: linj
 * @description base64加解密
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
  } catch {
    return ''
  }
}
