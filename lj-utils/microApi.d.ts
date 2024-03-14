/**
 * @module
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-22 00:41:33
 * @description 微信小程序/uniapp/taro公共函数
 */
import { AnyFn, AppConfig, Bool, AnyObject } from './types';
/**
 * @description 初始化配置(uniCloud/request拦截)
 * @function
 * @param {any} argConfig
 * @param {boolean} argConfig.localEncrypt 本地缓存是否加密
 */
export declare const init: (argConfig?: AppConfig) => void;
/**
 * @description 获取unicloud DB,返回实例
 * @function
 */
export declare const getDb: () => any;
/**
 * @description 显示loading
 * @function
 */
export declare const showLoading: () => void;
/**
 * @description 隐藏loading
 * @function
 */
export declare const hideLoading: () => void;
/**
 * @description 修改设置拦截函数
 * @function
 * @param {function} argRequest 请求拦截
 * @param {function} argResponse 响应拦截
 */
export declare const setRequest: (argRequest: AnyFn, argResponse: AnyFn) => void;
/**
 * @description 使用ljapi
 * @function
 * @param {AnyObject} argOption 传入参数
 * @returns {argOption} 返回修改后的参数
 */
export declare const ljApiFn: (argOption: AnyObject) => AnyObject;
/**
 * @description 封装小程序request
 * @function
 * @param {AnyObject} argOption http配置
 * @param {Bool} argIsMock 是否使用mock
 * @returns {promise}
 */
export declare const request: (argOption: AnyObject, argIsMock?: Bool) => Promise<any>;
/**
 * @description 图片上传 单图/多图
 * @function
 * @param {object} argOption 参数配置
 * @returns {promise} 上传回调
 */
export declare const uploadImg: (argOption: AnyObject) => Promise<any>;
/**
 * @function
 * @description 请求云函数
 * @param {object} argOption
 * @param {string} argOption.name 云函数名
 * @param {object} argOption.params 参数
 * @param {object} argOption.config 请求配置
 * }
 */
export declare const requestCloud: (argOption: AnyObject) => Promise<any>;
/**
 * @function
 * @description 检查是否有更新
 */
export declare const checkUpdate: () => void;
/**
 * @function
 * @description 检查用户授权状态，未授权弹出授权，(userInfo除外)，将拿到的权限放在authSetting 中
 * @param {string} argSet 要检查的权限,userInfo时：已授权会返回userInfo数据
 * @returns {promise}
 */
export declare const checkSetting: (argSet: string) => Promise<any>;
/**
 * @description 获取地理位置 (类型，)
 * @function
 * @param {string} argType 类型
 * @param {boolean} argAltitude 是否高精度
 * @returns {promise}
 */
export declare const getLocation: (argType?: string, argAltitude?: boolean) => Promise<any>;
/**
 * @description 回到顶部/某个位置
 * @function
 * @param {number} scrollTop 滚动距离
 * @param {number} duration 时间
 * @param {any} ...arg 其他参数selector/offsetTop/success/fail/complete
 * @returns {promise}
 */
export declare const scrollTop: (scrollTop?: number, duration?: number, ...arg: any[]) => Promise<any>;
/**
 * @description toast默认为文字提示,默认推迟320ms显示
 * @function
 * @param {string} argTitle title
 * @param {object} argOption 配置
 * argOption.icon:'图标',
 * argOption.delay: '延时显示ms'
 * argOption.duration："显示时间"
 * @returns {promise}
 */
export declare const toast: (argTitle: string, argOption?: AnyObject) => Promise<any>;
/**
 * @function
 * @description 设置标题
 * @param  {string} argTitle 标题
 */
export declare const setTitle: (argTitle: string) => void;
/**
 * @function
 * @description uniapp跳到特定页面
 * @param  {string} argPage 标题
 * @param  {object} argParams url参数
 * @param  {string|number} argType 跳转类型 switchTab reload redirectTo reLaunch navigateTo
 * @param {boolean} argForce 是否取消节流非H5生效
 */
export declare const toPage: (argPage?: string, argParams?: AnyObject, argType?: string | number, argForce?: Bool) => void;
/**
 * @function
 * @description 获取当前页面数据obj
 * @returns {object}
 */
export declare const getCurrentPage: () => AnyObject;
/**
 * @function
 * @description 获取当前页url
 * @param {boolean} argWithParams 是否附带参数
 * @returns {string}
 */
export declare const getCurrentPageUrl: (argWithParams?: boolean) => string;
/**
 * @function
 * @description 获取微信登录code
 * @returns {promise}
 */
export declare const login: () => Promise<any>;
/**
 * @function
 * @description 获取用户信息
 * @param {object} argData 用户数据（点按钮授权时传入）
 * @returns {promise}
 */
export declare function getUserInfo(argData: AnyObject): Promise<any>;
/**
 * @function
 * @description 下载图片到手机
 * @param {array} argImgList 图片url,数组或字符串
 * @param {boolean} argIsLocal 是否是本地临时文件路径或永久文件路径
 * @returns {promise} 出错时无promise
 */
export declare const downloadImgs: (argImgList: unknown, argIsLocal?: Bool) => Promise<any>;
/**
 * @function
 * @description 上传图片，返回临时图片路径
 * @param {object} argOptions
 * argOptions.count: 9,最多可以选择的图片张数
 * argOptions.sizeType: ['original', 'compressed'], 所选的图片的尺寸
 * argOptions.sourceType: ['album', 'camera'] album ,从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
 * argOptions.disCompress: false 是否关闭图片压缩，默认开启
 * } 外加选择图片chooseImage配置
 * @param {number} argMb 超过多少M压缩，默认1M(仅支持jpg)
 * @param {number} argQuality 压缩质量默认80
 * @param {number} argMaxSize 图片最长边默认1920
 * @returns {promise} 返回临时图片路径[{tempFilePath:'临时路径',size: '不压缩时返回'}]
 */
export declare const uploadImgs: (argOptions?: AnyObject, argMb?: number, argQuality?: number, argMaxSize?: number) => Promise<any>;
/**
 * @function
 * @description 检测浏览器状态，系统状态 *
 * @returns {object} {
 * ua: ua,
 * platform: 平台,
 * isMobile: 移动端,
 * isWin: winPC端,
 * isIphone: iphone,
 * isIpad: ipad,
 * isMac: mac,
 * isAppleMobile: 苹果移动端webview
 * isSafari: Safari浏览器,
 * isIos: Ios平台,
 * isAndroid: android平台,
 * isIE: 显示8 9 10, true为11以上
 * ...
 * }
 */
export declare const getSystemInfo: () => AnyObject;
/**
 * @function
 * @description 获取storage的值，默认将json转为obj
 * @param {string} argKey 要获取的key
 * @param {boolean} argNoJson true时不自动转换JSON字符串
 * @returns {promise} key对应的数据
 */
export declare const getStorage: (argKey: string, argNoJson?: boolean) => Promise<any>;
/**
 * @function
 * @description 获取storage的值，默认将json转为obj
 * @param {string} argKey 要获取的key
 * @param {boolean} argNoJson true时不自动转换JSON字符串
 * @returns {any} key对应的数据
 */
export declare const getStorageSync: (argKey: string, argNoJson?: boolean) => any;
/**
 * @function
 * @description 退出登录或登录失效，清除本地数据
 * @param {string} argKey 要删除的key,不填为删除全部
 * @param {string} argExtraKey:额外保留的key如：'vuex,ticket'
 * @param {boolean} isForce 是否强制删除全部
 */
export declare const clearStorageSync: (argKey?: string, argExtraKey?: string, isForce?: boolean) => Promise<void>;
/**
 * @function
 * @description 设置storage的值，默认将obj转为json
 * @param {string} argKey 要设置的key
 * @param {string|AnyObject} argData 要设置的值
 * @returns {promise} key对应的数据
 */
export declare const setStorage: (argKey: string, argData: string | AnyObject) => Promise<any>;
/**
 * @function
 * @description wx/taro/uni api转Promise
 * @param {string} argApi 需要转promise的API名称
 * @param {object} argOptions {} api对应的配置，除了success和fail
 * @returns {promise}
 */
export declare const P: (argApi: string, argOptions?: AnyObject) => Promise<any>;
/**
 * 描述
 * @function
 * @description 微信实时日志记录
 * @date 2019-09-26
 * @returns {AnyObject}
 */
export declare const wxLog: () => AnyObject;
/**
 * 描述
 * @function
 * @description 小程序云函数调用
 * @param {string} argOption 云函数配置
 * @date 2019-09-26
 * @returns {promise}
 */
export declare const cloudApi: (argOption?: AnyObject) => Promise<any>;
/**
 * @function
 * @description 富文本格式处理 for 小程序rich-text
 * @param {string} argData 富文本
 * @returns {string}
 */
export declare const getRichText: (argData: string) => string;
/**
 * @function
 * @description 页面刷新
 */
export declare const refresh: () => void;
interface GetDomOptions {
    id?: boolean;
    dataset?: boolean;
    rect?: boolean;
    size?: boolean;
    scrollOffset?: boolean;
    computedStyle?: any[];
    context?: boolean;
    properties?: any[];
}
/**
 * @function
 * @description: 获取dom节点相关信息
 * @param {object}  argThis: 当前this,
 * @param {string} argId id/class
 * @param {Boolean} getAll 是否获取全部 true时，返回数组
 * @param {object} argOptions 修改默认返回具体参考：https://uniapp.dcloud.io/api/ui/nodes-info?id=nodesreffields
 * @return: object/array
 */
export declare const getDom: (argThis: any, argId: string, getAll?: Bool, argOptions?: GetDomOptions) => Promise<unknown>;
/**
 * @description APP:返回 uni/wx/taro实例
 * @constant {object}
 */
export declare const APP: AnyObject;
/**
 * @description IS_H5:是否为H5
 * @constant {boolean}
 * @default false
 */
export declare const IS_H5 = true;
export {};
