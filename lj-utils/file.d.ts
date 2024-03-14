/**
 * @module index
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description 文件相关处理
 */
/**
 * @function blobToBase64
 * @description 将Blob对象转换为base64字符串
 * @date 2020-03-01
 * @param {Blob} argBlob 需要处理的Blob对象
 * @returns {Promise} 返回base64字符串
 * @example
 * blobToBase64(blob).then(base64 => console.log(base64));
 */
export declare const blobToBase64: (argBlob: Blob) => Promise<any>;
/**
 * @function blobUrlToFile
 * @description 将blobUrl转换为File对象
 * @date 2020-03-01
 * @param {string} argData blobUrl
 * @returns {Promise} 返回File对象
 * @example
 * blobUrlToFile(url).then(file => console.log(file));
 */
export declare const blobUrlToFile: (argData: string) => Promise<any>;
/**
 * @function dataURLtoBlob
 * @description 将图片的dataUrl base64转换为Blob对象
 * @param {string} argData dataUrl
 * @returns {Blob} 返回Blob对象
 * @example
 * const blob = dataURLtoBlob(dataUrl);
 */
export declare const dataURLtoBlob: (argData: string) => Blob;
/**
 * @function blobToFile
 * @description 将Blob对象转换为File对象
 * @param {Blob} argBlob Blob对象
 * @param {string} argName 文件名，默认为当前时间戳
 * @returns {File} 返回File对象
 * @example
 * const file = blobToFile(blob, 'example.txt');
 */
export declare const blobToFile: (argBlob: Blob, argName?: string) => File;
/**
 * @function dlFile
 * @description 下载文件
 * @param {string|Blob|File} argData Blob对象/File对象/dataUrl/base64
 * @param {string} argName 文件名
 * @param {number} argDelTime 移除dateUrl时间
 * @example
 * dlFile(data, 'example.txt', 10000);
 */
export declare const dlFile: (argData: string | Blob | File, argName?: string, argDelTime?: number) => void;
/**
 * @function getDuration
 * @description 获取音视频文件的时长
 * @param {Blob|File|string} argFile 音视频数据，如果是string类型，则为链接
 * @returns {Promise} 返回时长（单位：秒）
 * @example
 * getDuration(file).then(duration => console.log(duration));
 */
export declare const getDuration: (argFile: Blob | File | string) => Promise<any>;
/**
 * @function loadFile
 * @description 动态加载html文件标签
 * @param {string} argUrl 要加载的url
 * @param {string} argType 加载类型 js/css
 * @param {object} argOptions
 * @param {string} argOption.disCheck 不检查是否有相同标签
 * @param {string} argOption.force 是否强制添加，true时先删除再添加
 * @return {Promise} 返回Promise对象
 * @example
 * loadFile(url, 'js', {force: true}).then(() => console.log('Loaded'));
 */
export declare const loadFile: (argUrl: string, argType?: 'js' | 'css', argOptions?: {
    [key: string]: any;
}) => Promise<any>;
