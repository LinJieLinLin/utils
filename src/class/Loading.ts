import { AnyFn, Bool } from '../types'
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

export class Loading {
  // 请求数
  loadNum = 0
  #delay = 300
  // 计时
  #timer: any
  // 临时开始时间
  #showTime = 0
  showCb: AnyFn = () => {}
  hideCb: AnyFn = () => {}
  /**
   * @function
   * @param {function} argShow 显示loading 回调
   * @param {function} argHide 隐藏loading 回调
   * @param {number} [argDelay]=300 argDelay 延时 ms,不宜过长,默认300
   */
  constructor(argShow?: unknown, argHide?: unknown, argDelay: number = 300) {
    if (typeof argShow === 'function') {
      this.showCb = argShow as AnyFn
    }
    if (typeof argHide === 'function') {
      this.hideCb = argHide as AnyFn
    }
    this.#delay = argDelay || 300
  }
  /**
   * @function
   * @param {boolean} isAdd 是否增加一个请求loading
   * @description 是否增加一个请求loading，true +1,false -1
   */
  loading(isAdd: Bool = false) {
    if (isAdd) {
      if (!this.loadNum) {
        this.#timer = setTimeout(() => {
          this.#showTime = +new Date()
          this.showCb()
        }, this.#delay)
      }
      this.loadNum++
    } else {
      this.loadNum--
      if (this.loadNum < 0) {
        this.loadNum = 0
      }
    }
    if (!this.loadNum) {
      clearTimeout(this.#timer)
      setTimeout(() => {
        if (this.#showTime) {
          console.debug(
            '显示loading时长:',
            (+new Date() - this.#showTime) / 1000
          )
        }
        this.hideCb()
      }, 0)
    }
  }
  /**
   * @function
   * @description 显示loading，同loading(1)
   */
  show() {
    this.loading(true)
  }
  /**
   * @function
   * @description 隐藏loading，同loading(0)
   */
  hide() {
    this.loading(false)
  }
}
export default Loading
