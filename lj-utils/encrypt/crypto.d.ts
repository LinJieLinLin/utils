/**
 * @module
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 需安装crypto-js依赖，小程序引用crypto-js比较大，如果只是base64的转换，引用base64.js即可
 */
import CryptoJS from 'crypto-js';
/**
 * @function
 * @description aes初始化,选定aes加密码方式后，先执行初始化
 * @param {string} argKey 密钥
 * @param {string} argIv 密钥偏移量
 */
export declare function aesInit(argKey: string, argIv: string): void;
/**
 * @function
 * @description aes加密
 * @param {string | number} word 待加密内容
 * @returns {string} 已加密内容
 */
export declare const enAes: (word: string | number) => string;
/**
 * @function
 * @description aes解密
 * @param {string} word 待解密内容
 * @returns {string} 已解密内容
 */
export declare const deAes: (word: string) => string;
/**
 * @function
 * @description md5 加密
 * @param {string | CryptoJS.lib.WordArray} argData 待加密内容
 * @returns {string} 已加密内容
 */
export declare const md5: (argData: string | CryptoJS.lib.WordArray) => string;
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
