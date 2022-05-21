/**
 * @class
 * @classdesc 处理函数节流
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @example  const tr = new.Throttle(回调函数,等待时间,...回调函数的参数)
 */
class Throttle {
  #trTime = 0
  clickTime = 0
  /**
   * @function
   * @description 函数节流，触发一次后，再间隔n毫秒后才会被触发
   * @param  {function} argFn 回调函数
   * @param  {number} argWait 等待时间,默认1000毫秒
   * @param  {any} ...arg 回调函数的参数
   * @returns {function}
   */
  throttle(
    argFn: (...arg: any) => any,
    argWait: number = 1000,
    ...args: any
  ): (...arg: any) => any {
    if (argWait - (Date.now() - this.#trTime) <= 0) {
      this.#trTime = Date.now()
      this.clickTime = 0
      setTimeout(() => {
        if (this.clickTime > 0) {
          this.#trTime = 0
          this.clickTime = 0
        }
      }, argWait)
      return argFn(...args)
    } else {
      this.clickTime++
      return () => this
    }
  }
}
export default Throttle
