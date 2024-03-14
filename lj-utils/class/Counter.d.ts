import { AnyFn } from '../types';
/**
 * @class
 * @classdesc new对象时可传入计数
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @example
 * const counter = new Counter(60, () => {})
 * counter.stop()
 * counter.setCount(60)
 * counter.start()
 */
export declare class Counter {
    #private;
    count: number;
    maxCount: number;
    cb: AnyFn;
    /**
     * @description:
     * @param {number} argCount 开始计时秒数
     * @param {function} argCb 回调函数
     */
    constructor(argCount?: number, argCb?: AnyFn);
    /**
     * @function
     * @param {number} argCount 当前倒计时数值
     * @description 设置当前倒计时数值
     */
    setCount(argCount?: number): this;
    /**
     * @function
     * @param {number} argCount 初始倒计数
     * @description 设置初始倒计时数值
     */
    setMaxCount(argCount?: number): this;
    /**
     * @function
     * @param {function} argCb 计时回调,返回当前剩余秒数
     * @description 开始倒计时
     */
    start(argCb?: AnyFn): this;
    /**
     * @function
     * @description 停止倒计时
     */
    stop(): this;
}
export default Counter;
