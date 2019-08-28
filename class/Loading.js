/**
 * @class
 * @classdesc 通用loading
 */
class Loading {
  // 请求数
  requestNum = 0
  delay = 300
  // 计时
  timmer = null
  // 临时时间
  temTime = null
  // 临时开始时间
  temStartTime = null
  show = () => {}
  hide = () => {}
  /**
   * @function
   * @param {function} argShow 显示loading 回调
   * @param {function} argHide 隐藏loading 回调
   * @param {number} delay 延时 ms,不宜过长,默认300
   */
  constructor(argShow, argHide, argdelay) {
    if (typeof argShow === 'function') {
      this.show = argShow
    }
    if (typeof argHide === 'function') {
      this.hide = argHide
    }
    this.delay = argdelay || 300
  }
  /**
   * @function
   * @param {boolean} isAdd 是否增加一个请求loading
   * @description 是否增加一个请求loading，true +1,false -1
   */
  loading(isAdd) {
    if (isAdd) {
      if (!this.requestNum) {
        this.temTime = +new Date()
        this.timmer = setTimeout(() => {
          this.temStartTime = +new Date()
          console.info(
            '显示loading用时：',
            (this.temStartTime - this.temTime) / 1000
          )
          this.show()
        }, this.delay)
      }
      this.requestNum++
    } else {
      this.requestNum--
      if (this.requestNum < 0) {
        this.requestNum = 0
      }
    }
    if (!this.requestNum) {
      clearTimeout(this.timmer)
      setTimeout(() => {
        if (this.temStartTime) {
          console.info(
            '显示loading时长：',
            (+new Date() - this.temStartTime) / 1000
          )
        }
        this.hide()
      }, this.delay)
    }
  }
}
export default Loading
