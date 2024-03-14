/**
 * @module index
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 判断函数
 */
/**
 * @function isPrime
 * @description 判断一个数是否为质数
 * @param {number} argValue 需要判断的数值
 * @returns {boolean} 如果是质数返回true，否则返回false
 * @example
 * isPrime(5); // true
 */
export declare const isPrime: (argValue: number) => boolean;
/**
 * @function isJson
 * @description 判断一个值是否为JSON
 * @param  {any} argData 需要判断的数据
 * @returns {boolean} 如果是JSON返回true，否则返回false
 * @example
 * isJson('{"name":"John"}'); // true
 */
export declare const isJson: (argData: any) => boolean;
/**
 * @function isBlob
 * @description 判断一个值是否为Blob
 * @param  {any} argData 需要判断的数据
 * @returns {boolean} 如果是Blob返回true，否则返回false
 * @example
 * isBlob(new Blob()); // true
 */
export declare const isBlob: (argData: any) => boolean;
/**
 * @function isFile
 * @description 判断一个值是否为File
 * @param  {any} argData 需要判断的数据
 * @returns {boolean} 如果是File返回true，否则返回false
 * @example
 * isFile(new File([""], "filename")); // true
 */
export declare const isFile: (argData: any) => boolean;
/**
 * @function isIdCard
 * @description 判断一个字符串是否为正确的身份证号码
 * @param  {string} code 身份证号码
 * @returns {boolean} 如果是正确的身份证号码返回true，否则返回false
 * @example
 * isIdCard('320311770706001'); // false
 */
export declare const isIdCard: (code: string) => boolean;
