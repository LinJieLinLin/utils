/**
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @description no
 */
/**
 * @description 深度递归设置只读
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export interface UniCloudConfig {
    /**aliyun、tencent*/
    provider: string;
    /**服务空间ID*/
    spaceId: string;
    clientSecret?: string;
    endpoint?: string;
}
export interface AnyFn {
    (...arg: any[]): any;
}
export interface AppConfig extends AnyObject {
    /**localstorage数据是否加密 */
    localEncrypt?: boolean;
    /**uniCloud配置 */
    uniCloud?: UniCloudConfig | undefined;
    /**请求拦截回调 */
    requestCb?: AnyFn;
    /**响应拦截回调 */
    responseCb?: AnyFn;
    /** 全局请求url */
    baseUrl?: string;
}
export interface Info {
    ua: string;
    platform: string;
    isMobile: boolean;
    isWin: boolean;
    isIphone: boolean;
    isIpad: boolean;
    isMac: boolean;
    isAppleMobile: boolean;
    isSafari: boolean;
    isIos: boolean;
    isAndroid: boolean;
    isIE: boolean;
    ieVersion: number;
    /**判断微信环境 */
    isWeixin: boolean;
    /**判断支付宝环境 */
    isAlipay: boolean;
}
export interface AnyObject {
    [key: string | symbol | number]: any;
}
export interface StringObject {
    [key: string]: string;
}
/**boolean 1 0类型，用于判断 true|false*/
export type Bool = boolean | 1 | 0;
/**https://uniapp.dcloud.io/api/request/network-file.html#uploadfile */
export interface UploadFile {
    /**服务器 url */
    url: string;
    /**需要上传的文件列表。使用 files 时，filePath 和 name 不生效。 */
    files?: [];
    /**文件类型，image/video/audio仅支付宝小程序，且必填。 */
    fileType?: string;
    /**要上传的文件对象。仅H5（2.6.15+）支持 */
    file?: File;
    /**要上传文件资源的路径。 files和filePath选其一 */
    filePath?: string;
    /**文件名称 */
    name?: string;
    /**HTTP 请求 Header, header 中不能设置 Referer。 */
    header?: AnyObject;
    /**超时时间，单位 ms */
    timeout?: number;
    /**HTTP 请求中其他额外的 form data */
    formData?: AnyObject | null;
}
declare const _default: {};
export default _default;
