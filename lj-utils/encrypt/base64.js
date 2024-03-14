import { encode as encode$1, decode as decode$1 } from 'js-base64';

/**
 * @module
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description base64加解密
 */
/**
 * @function
 * @description base64 加密
 * @param {string | number} argData 待加密内容
 * @returns {string} 已加密内容
 */
const enBase64 = (argData) => {
    argData = argData || '';
    var base64 = encode$1(argData.toString());
    return base64;
};
/**
 * @function
 * @description base64 解密
 * @param {string} argData 待解密内容
 * @returns {string} 已解密内容
 */
const deBase64 = (argData) => {
    try {
        argData = argData || '';
        var base64 = decode$1(argData);
        return base64;
    }
    catch {
        return '';
    }
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
        default:
            return argData;
    }
};

export { deBase64, decode, enBase64, encode };
