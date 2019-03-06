/**
 * 公共函数
 * @class
 * @author linj
 * @description 公共类
 */
/**
 * @class
 * @classdesc new对象时可传入计数
 * .start 开始计时(需要传入回调函数，返回当前计数)
 * .stop 停止计时
 */
export class Counter {
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
  }
  /**
   * @function
   * @param {number} argCount 初始倒计数
   * @description 设置初始倒计时数值
   */
  setMaxCount(argCount = 60) {
    this.maxCount = argCount
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
  }
  /**
   * @function
   * @description 停止倒计时
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
/**
 * @class
 * @classdesc 通用loading
 */
export class Loading {
  // 请求数
  requestNum = 0
  delayed = 300
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
   * @param {number} delayed 延时 ms,不宜过长,默认300
   */
  constructor(argShow, argHide, argDelayed) {
    if (typeof argShow === 'function') {
      this.show = argShow
    }
    if (typeof argHide === 'function') {
      this.hide = argHide
    }
    this.delayed = argDelayed || 300
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
        }, this.delayed)
      }
      this.requestNum++
    } else {
      this.requestNum--
    }
    console.info('当前请求数', this.requestNum)
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
      }, this.delayed)
    }
  }
}
