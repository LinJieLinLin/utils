import Utf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';

/**
 * @module
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 需安装crypto-js依赖，小程序引用crypto-js比较大，如果只是base64的转换，引用base64.js即可
 */
let key = 'by';
/**
 * @function
 * @description aes初始化,选定aes加密码方式后，先执行初始化
 * @param {string} argKey 密钥
 */
function aesInit(argKey) {
    key = argKey; //密钥
}
/**
 * @function
 * @description aes加密
 * @param {string | number} word 待加密内容
 * @returns {string} 已加密内容
 */
const enAes = (word) => AES.encrypt(word.toString(), key).toString();
/**
 * @function
 * @description aes解密
 * @param {string} word 待解密内容
 * @returns {string} 已解密内容
 */
const deAes = (word) => {
    try {
        return AES.decrypt(word, key).toString(Utf8);
    }
    catch (error) {
        console.error(error);
        return '';
    }
};
/**
 * @function
 * @description md5 加密
 * @param {string | CryptoJS.lib.WordArray} argData 待加密内容
 * @returns {string} 已加密内容
 */
const md5 = (argData) => MD5(argData).toString();
/**
 * @function
 * @description base64 加密
 * @param {string | number} argData 待加密内容
 * @returns {string} 已加密内容
 */
const enBase64 = (argData) => {
    argData = argData.toString() || '';
    let wordArray = Utf8.parse(argData);
    let base64 = Base64.stringify(wordArray);
    return base64;
};
/**
 * @function
 * @description base64 解密
 * @param {string} argData 待解密内容
 * @returns {string} 已解密内容
 */
const deBase64 = (argData) => {
    argData = argData || '';
    let wordArray = Base64.parse(argData);
    let base64 = wordArray.toString(Utf8);
    return base64;
};
/**
 * @function
 * @description 加密
 * @param {string | number} argData 待加密内容
 * @param {string} argType 加密类型，默认base64
 * @returns {string} 已加密内容
 */
const encode = (argData, argType = 'base64') => {
    switch (argType) {
        case 'base64':
            return enBase64(argData);
        case 'aes':
            return enAes(argData);
        default:
            return argData.toString();
    }
};
/**
 * @function
 * @description 解密
 * @param {string} argData 待解密内容
 * @param {string} argType 解密类型，默认base64
 * @returns {string} 已解密内容
 */
const decode = (argData, argType = 'base64') => {
    switch (argType) {
        case 'base64':
            return deBase64(argData);
        case 'aes':
            return deAes(argData);
        default:
            return argData;
    }
};

export { aesInit, deAes, deBase64, decode, enAes, enBase64, encode, md5 };
