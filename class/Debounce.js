/**
 * @class
 * @classdesc 函数抖动
 * .debounce(回调函数,等待时间,...回调函数的参数)
 */
class Debounce {
  timer = null
  dbTime = 0
  constructor() {
    this.dbTime = Date.now()
  }
  /**
   * @function
   * @description 函数抖动，在等待n毫秒无点击后触发
   * @param  {function} argFn 回调函数
   * @param  {number} argWait 等待时间,默认0.5秒
   * @param  {any} ...arg 回调函数的参数
   * @returns {function}
   */
  debounce(argFn, argWait = 500) {
    if (typeof argFn !== 'function') {
      argFn = () => {
        return this
      }
    }
    if (argWait - (Date.now() - this.dbTime) <= 0) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let [, , ...args] = [...arguments]
        return argFn(...args)
      }, argWait)
    }
  }
}
export default Debounce
