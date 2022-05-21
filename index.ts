/**
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description no
 */
export { isPrime, isJson, isBlob, isFile, isIdCard } from './is'
export {
  getNetworkStatus,
  getRegexp,
  setTitle,
  remInit,
  getCookie,
  setCookie,
  delCookie,
  setStorage,
  getStorage,
  getRandomColor,
  getInfo,
  sleep,
} from './base'
export {
  blobToBase64,
  blobUrlToFile,
  dataURLtoBlob,
  blobToFile,
  dlFile,
  getDuration,
  loadFile,
} from './file'
export {
  toFixed,
  toLine,
  toHump,
  string10to62,
  string62to10,
  setUrlParams,
  getUrlParam,
  getUrlParamObj,
  replaceUrlParam,
  encodeHtml,
  decodeHtml,
  hideInfo,
  safeData,
  getUuid,
  setEnv,
  getEnv,
  getObj,
  setObj,
  randomInt,
  setLog,
} from './data'
export {
  rmbPrice,
  formatTime,
  friendlyTime,
  px2vw,
  secondToTime,
  formatSize,
  formatNumber,
} from './transform'
