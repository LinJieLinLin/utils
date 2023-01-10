import { AnyFn } from '../types'
/**
 * @class
 * @classdesc new对象时可传入计数
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 * @example
 * const counter = new Counter(60, () => {})
 * counter.start() 开始计时(可传入回调函数，返回当前计数)
 * counter.stop() 停止计时
 */
export class Counter {
  count = 0
  maxCount = 0
  #timer: any
  cb: AnyFn = (a) => a
  /**
   * @description:
   * @param {number} argCount 开始计时秒数
   * @param {function} argCb 回调函数
   */
  constructor(argCount: number = 60, argCb?: AnyFn) {
    this.count = argCount
    this.maxCount = argCount
    if (argCb) this.cb = argCb
  }

  /**
   * @function
   * @param {number} argCount 当前倒计时数值
   * @description 设置当前倒计时数值
   */
  setCount(argCount: number = 60): this {
    this.count = argCount
    if (!argCount) {
      this.stop()
    }
    return this
  }

  /**
   * @function
   * @param {number} argCount 初始倒计数
   * @description 设置初始倒计时数值
   */
  setMaxCount(argCount: number = 60) {
    this.maxCount = argCount
    return this
  }

  /**
   * @function
   * @param {function} argCb 计时回调,返回当前剩余秒数
   * @description 开始倒计时
   */
  start(argCb?: AnyFn) {
    const cbFn: AnyFn = argCb || this.cb
    // count为0时从最大值开始
    if (!this.count) {
      this.count = this.maxCount
    }
    if (this.#timer) {
      clearInterval(this.#timer)
    }
    cbFn(this.count)
    this.#timer = setInterval(() => {
      this.count--
      if (this.count === -1) {
        this.count = this.maxCount
      }
      cbFn(this.count)
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
    if (this.#timer) {
      clearInterval(this.#timer)
    }
    return this
  }
}
export default Counter
