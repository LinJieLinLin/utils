/**
 * @class
 * @classdesc 函数节流
 * .throttle(回调函数,等待时间,...回调函数的参数)
 */
class Throttle {
  trTime = 0
  clickTime = 0
  constructor() {
    this.trTime = Date.now()
  }
  /**
   * @function
   * @description 函数节流，触发一次后，再间隔n毫秒后才会被触发
   * @param  {function} argFn 回调函数
   * @param  {number} argWait 等待时间,默认1000毫秒
   * @param  {any} ...arg 回调函数的参数
   * @returns {function}
   */
  throttle(argFn, argWait = 1000) {
    if (typeof argFn !== 'function') {
      argFn = () => {
        return this
      }
    }
    if (argWait - (Date.now() - this.trTime) <= 0) {
      this.trTime = Date.now()
      this.clickTime = 0
      let [, , ...args] = [...arguments]
      setTimeout(() => {
        if (this.clickTime > 0) {
          this.trTime = 0
          this.clickTime = 0
        }
      }, argWait)
      return argFn(...args)
    } else {
      this.clickTime++
    }
  }
}
export default Throttle
