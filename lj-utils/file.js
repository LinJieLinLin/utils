import { safeData } from './base.js';

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
const blobToBase64 = async (argBlob) => {
    // eslint-disable-next-line no-undef
    const fileReader = new FileReader();
    fileReader.readAsDataURL(argBlob);
    fileReader.onload = (e) => {
        return Promise.resolve(e && e.target && e.target.result);
    };
    fileReader.onerror = () => {
        return Promise.reject(new Error('文件流异常'));
    };
};
/**
 * @function blobUrlToFile
 * @description 将blobUrl转换为File对象
 * @date 2020-03-01
 * @param {string} argData blobUrl
 * @returns {Promise} 返回File对象
 * @example
 * blobUrlToFile(url).then(file => console.log(file));
 */
const blobUrlToFile = async (argData) => {
    return new Promise(function (resolve, reject) {
        // eslint-disable-next-line no-undef
        var xhr = new XMLHttpRequest();
        xhr.open('GET', argData, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (this.status === 200) {
                return resolve(this.response);
            }
        };
        xhr.onerror = (err) => {
            return reject(err);
        };
        xhr.send();
    });
};
/**
 * @function dataURLtoBlob
 * @description 将图片的dataUrl base64转换为Blob对象
 * @param {string} argData dataUrl
 * @returns {Blob} 返回Blob对象
 * @example
 * const blob = dataURLtoBlob(dataUrl);
 */
const dataURLtoBlob = (argData) => {
    if (!argData.match(/;base64,/)) {
        return new Blob();
    }
    let arr = argData.split(',');
    let mime = safeData(arr[0].match(/:(.*?);/), '1', '');
    if (!mime) {
        return new Blob();
    }
    let bstr = globalThis.atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};
/**
 * @function blobToFile
 * @description 将Blob对象转换为File对象
 * @param {Blob} argBlob Blob对象
 * @param {string} argName 文件名，默认为当前时间戳
 * @returns {File} 返回File对象
 * @example
 * const file = blobToFile(blob, 'example.txt');
 */
const blobToFile = (argBlob, argName = Date.now().toString()) => {
    let file = new File([argBlob], argName, {
        type: argBlob.type,
    });
    return file;
};
/**
 * @function dlFile
 * @description 下载文件
 * @param {string|Blob|File} argData Blob对象/File对象/dataUrl/base64
 * @param {string} argName 文件名
 * @param {number} argDelTime 移除dateUrl时间
 * @example
 * dlFile(data, 'example.txt', 10000);
 */
const dlFile = (argData, argName = Date.now().toString(), argDelTime = 10000) => {
    let downNode = globalThis.document.createElement('a');
    downNode.download = argName;
    // 字符内容转换为blob地址
    let href = '';
    if (typeof argData === 'string') {
        if (argData.startsWith('blob:')) {
            href = argData;
        }
        else if (argData.startsWith('data:')) {
            href = argData;
        }
        argData = new Blob([argData]);
    }
    href = href || URL.createObjectURL(argData);
    downNode.href = href;
    setTimeout(() => {
        URL.revokeObjectURL(href);
    }, argDelTime);
    globalThis.document.body.appendChild(downNode);
    downNode.click();
    globalThis.document.body.removeChild(downNode);
};
/**
 * @function getDuration
 * @description 获取音视频文件的时长
 * @param {Blob|File|string} argFile 音视频数据，如果是string类型，则为链接
 * @returns {Promise} 返回时长（单位：秒）
 * @example
 * getDuration(file).then(duration => console.log(duration));
 */
const getDuration = async (argFile) => {
    let filePath;
    if (typeof argFile === 'string') {
        filePath = argFile;
    }
    else {
        filePath = URL.createObjectURL(argFile);
    }
    return new Promise((resolve, reject) => {
        const audio = new Audio(filePath);
        audio.addEventListener('loadedmetadata', function (e) {
            if (filePath.startsWith('blob:')) {
                URL.revokeObjectURL(filePath);
            }
            const duration = audio.duration;
            audio.src = '';
            return resolve(duration);
        });
        setTimeout(() => {
            return reject(new Error('读取时长超时'));
        }, 5000);
    });
};
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
const loadFile = (argUrl, argType = 'js', argOptions = {}) => {
    let temId = argType + '-' + argUrl.split('/').pop();
    let head = globalThis.document.getElementsByTagName('head')[0];
    let nodeTag;
    if (!argOptions.disCheck) {
        let checkTag = globalThis.document.getElementById(temId);
        // 已经存在对应tag
        if (checkTag) {
            if (argOptions.force) {
                head.removeChild(checkTag);
            }
            else {
                return Promise.resolve({ msg: '已存在，中断加载！' });
            }
        }
    }
    switch (argType) {
        case 'css':
            nodeTag = globalThis.document.createElement('link');
            nodeTag.type = 'text/css';
            nodeTag.rel = 'stylesheet';
            nodeTag.href = argUrl;
            break;
        case 'js':
            nodeTag = globalThis.document.createElement('script');
            nodeTag.src = argUrl;
            nodeTag.type = 'text/javascript';
            break;
        default:
            console.error('暂不支持：' + argType);
            return Promise.reject({ msg: '暂不支持：' + argType });
    }
    nodeTag.id = temId;
    head.appendChild(nodeTag);
    return new Promise((resolve) => {
        if (nodeTag.readyState) {
            nodeTag.onreadystatechange = function () {
                if (nodeTag.readyState === 'complete') {
                    nodeTag.onreadystatechange = null;
                    return resolve(argUrl);
                }
            };
        }
        else {
            // Others
            nodeTag.onload = function () {
                return resolve(argUrl);
            };
        }
    });
};

export { blobToBase64, blobToFile, blobUrlToFile, dataURLtoBlob, dlFile, getDuration, loadFile };
