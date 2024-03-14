import { AnyFn, Bool } from '../types';
/**
 * @class
 * @classdesc 通用延时loading
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @example
 * const L = new.Loading(argShow,argHide,300)
 * L.show()
 * L.hide()
 * L.loading(1)
 * L.loading(0)
 */
export declare class Loading {
    #private;
    loadNum: number;
    showCb: AnyFn;
    hideCb: AnyFn;
    /**
     * @function
     * @param {function} argShow 显示loading 回调
     * @param {function} argHide 隐藏loading 回调
     * @param {number} [argDelay]=300 argDelay 延时 ms,不宜过长,默认300
     */
    constructor(argShow?: unknown, argHide?: unknown, argDelay?: number);
    /**
     * @function
     * @param {boolean} isAdd 是否增加一个请求loading
     * @description 是否增加一个请求loading，true +1,false -1
     */
    loading(isAdd?: Bool): void;
    /**
     * @function
     * @description 显示loading，同loading(1)
     */
    show(): void;
    /**
     * @function
     * @description 隐藏loading，同loading(0)
     */
    hide(): void;
}
export default Loading;
