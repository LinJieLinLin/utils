import CryptoJS from 'crypto-js'
let key = 'by'
let iv = 'linj'
// 初始化
function init (argKey, argIv) {
  key = CryptoJS.enc.Utf8.parse(argKey) // 十六位十六进制数作为密钥
  iv = CryptoJS.enc.Utf8.parse(argIv) // 十六位十六进制数作为密钥偏移量
}
// 解密方法
function decrypt (word) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

// 加密方法
function encrypt (word) {
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
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString().toUpperCase()
}
export default {
  decrypt,
  encrypt,
  init
}
