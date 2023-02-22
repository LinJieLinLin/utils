/**
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description no
 */

export declare interface UniCloudConfig {
  /**aliyun、tencent*/
  provider: string
  /**服务空间ID*/
  spaceId: string
  /*仅阿里云支持，可以在uniCloud控制台 (opens new window)服务空间列表中查看*/
  clientSecret?: string
  /*服务空间地址，仅阿里云侧支持*/
  endpoint?: string
}
export declare interface AnyFn {
  (...arg: any[]): any
}
export declare interface AppConfig extends AnyObject {
  /**localstorage数据是否加密 */
  localEncrypt?: boolean
  /**uniCloud配置 */
  uniCloud?: UniCloudConfig | undefined
  /**请求拦截回调 */
  requestCb?: AnyFn
  /**响应拦截回调 */
  responseCb?: AnyFn
  /** 全局请求url */
  baseUrl?: string
}
export declare interface Info {
  ua: string
  platform: string
  isMobile: boolean
  isWin: boolean
  isIphone: boolean
  isIpad: boolean
  isMac: boolean
  isAppleMobile: boolean
  isSafari: boolean
  isIos: boolean
  isAndroid: boolean
  isIE: boolean
  ieVersion: number
  /**判断微信环境 */
  isWeixin: boolean
  /**判断支付宝环境 */
  isAlipay: boolean
}
export declare interface AnyObject {
  [key: string]: any
}
/**boolean 1 0类型，用于判断 true|false*/
export declare type Bool = boolean | 1 | 0
/**https://uniapp.dcloud.io/api/request/network-file.html#uploadfile */
export declare interface UploadFile {
  /**服务器 url */
  url: string
  /**需要上传的文件列表。使用 files 时，filePath 和 name 不生效。 */
  files?: []
  /**文件类型，image/video/audio仅支付宝小程序，且必填。 */
  fileType?: string
  /**要上传的文件对象。仅H5（2.6.15+）支持 */
  file?: File
  /**要上传文件资源的路径。 files和filePath选其一 */
  filePath?: string
  /**文件名称 */
  name?: string
  /**HTTP 请求 Header, header 中不能设置 Referer。 */
  header?: AnyObject
  /**超时时间，单位 ms */
  timeout?: number
  /**HTTP 请求中其他额外的 form data */
  formData?: AnyObject | null
}
