/**
 * 公共函数
 * @module
 * @author linj
 * @description 公共函数 小程序引用crypto-js比较大，如果只是base64的转换，引用base64.js即可
 */
import CryptoJS from 'crypto-js'
let key = 'by'
let iv = 'linj'
/**
 * @function
 * @description aes初始化,选定aes加密码方式后，先执行初始化
 * @param {string} argKey 密钥
 * @param {string} argIv 密钥偏移量
 */
export function aesInit(argKey, argIv) {
  key = CryptoJS.enc.Utf8.parse(argKey) // 十六位十六进制数作为密钥
  iv = CryptoJS.enc.Utf8.parse(argIv) // 十六位十六进制数作为密钥偏移量
}

/**
 * @function
 * @description aes加密
 * @param {string} word 待加密内容
 * @returns {string} 已加密内容
 */
export const enAes = (word) => {
  if (typeof word === 'object') {
    word = JSON.stringify(word)
  }
  if (typeof word === 'number') {
    word += ''
  }
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString().toUpperCase()
}
/**
 * @function
 * @description aes解密
 * @param {string} word 待解密内容
 * @returns {string} 已解密内容
 */
export const deAes = (word) => {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
/**
 * @function
 * @description md5 加密
 * @param {string} argData 待加密内容
 * @returns {string} 已加密内容
 */
export const md5 = (argData) => CryptoJS.MD5(argData).toString()
/**
 * @function
 * @description base64 加密
 * @param {string} argData 待加密内容
 * @returns {string} 已加密内容
 */
export const enBase64 = (argData) => {
  argData = argData || ''
  var wordArray = CryptoJS.enc.Utf8.parse(argData)
  var base64 = CryptoJS.enc.Base64.stringify(wordArray)
  return base64
}
/**
 * @function
 * @description base64 解密
 * @param {string} argData 待解密内容
 * @returns {string} 已解密内容
 */
export const deBase64 = (argData) => {
  argData = argData || ''
  var wordArray = CryptoJS.enc.Utf8.parse(argData)
  var base64 = CryptoJS.enc.Base64.stringify(wordArray)
  return base64
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
      return enAes(argData)
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
      return deAes(argData)
  }
}
