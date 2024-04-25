/**
 * @class
 * @classdesc
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @example
 * const tr = new Throttle()
 * tr.throttle(fn,1000,...args)
 */
export class Throttle {
  #trTime = 0
  clickTime = 0
  /**
   * @function
   * @description 函数节流，触发一次后，再间隔n毫秒后才会被触发
   * @param  {function} argFn 回调函数
   * @param  {number} argWait 等待时间,默认1000毫秒
   * @param  {any} args ...args 回调函数的参数
   * @returns {void}
   */
  throttle(
    argFn: (...arg: any) => any,
    argWait: number = 1000,
    ...args: any
  ): void {
    if (argWait - (Date.now() - this.#trTime) <= 0) {
      this.#trTime = Date.now()
      this.clickTime = 0
      argFn(...args)
    } else {
      this.clickTime++
    }
  }
}
export default Throttle
