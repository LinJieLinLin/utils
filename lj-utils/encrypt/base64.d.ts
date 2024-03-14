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
export declare const enBase64: (argData: string | number) => string;
/**
 * @function
 * @description base64 解密
 * @param {string} argData 待解密内容
 * @returns {string} 已解密内容
 */
export declare const deBase64: (argData: string) => string;
/**
 * @function
 * @description 加密
 * @param {string | number} argData 待加密内容
 * @param {string} argType 加密类型，默认base64
 * @returns {string} 已加密内容
 */
export declare const encode: (argData: string | number, argType?: string) => string;
/**
 * @function
 * @description 解密
 * @param {string} argData 待解密内容
 * @param {string} argType 解密类型，默认base64
 * @returns {string} 已解密内容
 */
export declare const decode: (argData: string, argType?: string) => string;
