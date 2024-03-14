import { AnyFn } from '../types';
/**
 * @class
 * @classdesc 处理函数抖动
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @example
 * const db = new Debounce()
 * db.debounce(fn,500,params1,params*)
 */
export declare class Debounce {
    #private;
    /**
     * @function
     * @description 函数抖动，在等待n毫秒无点击后触发
     * @param  {function} argFn 回调函数
     * @param  {number} argWait 等待时间,默认0.5秒
     * @param  {any} args ...arg 回调函数的参数
     * @returns {function}
     */
    debounce(argFn: AnyFn, argWait?: number, ...args: any): any;
}
export default Debounce;
