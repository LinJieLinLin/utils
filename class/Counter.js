/**
 * @class
 * @classdesc new对象时可传入计数
 * .start 开始计时(需要传入回调函数，返回当前计数)
 * .stop 停止计时
 */
class Counter {
  count = 0
  maxCount = 0
  timer = null
  constructor(argCount = 60) {
    this.count = argCount
    this.maxCount = argCount
  }
  /**
   * @function
   * @param {number} argCount 设置倒计时数值
   * @description 设置倒计时数值
   */
  setCount(argCount = 60) {
    this.count = argCount
    return this
  }
  /**
   * @function
   * @param {number} argCount 初始倒计数
   * @description 设置初始倒计时数值
   */
  setMaxCount(argCount = 60) {
    this.maxCount = argCount
    return this
  }
  /**
   * @function
   * @param {function} argCb 计时回调,返回当前剩余秒数
   * @description 开始倒计时
   */
  start(argCb) {
    if (!argCb) {
      console.error('需要传入计时回调')
      return
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
      this.count--
      if (this.count === -1) {
        this.count = this.maxCount
      } else {
        argCb(this.count)
      }
      if (this.count < 1) {
        this.stop()
      }
    }, 1000)
    return this
  }
  /**
   * @function
   * @description 停止倒计时
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    return this
  }
}
export default Counter
