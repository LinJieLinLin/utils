/**
 * @class
 * @classdesc 处理函数抖动
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @example
 * const db = new Debounce()
 * db.debounce(fn,500,params1,params*)
 */
class Debounce {
    #timer;
    /**
     * @function
     * @description 函数抖动，在等待n毫秒无点击后触发
     * @param  {function} argFn 回调函数
     * @param  {number} argWait 等待时间,默认0.5秒
     * @param  {any} args ...arg 回调函数的参数
     * @returns {function}
     */
    debounce(argFn, argWait = 500, ...args) {
        if (this.#timer) {
            clearTimeout(this.#timer);
        }
        this.#timer = setTimeout(() => {
            return argFn(...args);
        }, argWait);
    }
}

export { Debounce, Debounce as default };
