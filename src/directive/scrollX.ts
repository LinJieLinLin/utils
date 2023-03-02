import { AnyObject } from "../types"

/*
import scrollX from './scrollX';
 * @module
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2021-11-30 17:50:18
 * @description: 盒子滚动条拖拽用于父节点
 */
const on = (function () {
  if (typeof document.addEventListener === 'function') {
    return function (el: any, event: string, handler: any) {
      if (el && event && handler) {
        el.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (el: any, event: string, handler: any) {
      if (el && event && handler) {
        el.attachEvent('on' + event, handler)
      }
    }
  }
})()

const off = (function () {
  if (typeof document.removeEventListener === 'function') {
    return function (el: any, event: string, handler: any) {
      if (el && event) {
        el.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (el: any, event: string, handler: any) {
      if (el && event) {
        el.detachEvent('on' + event, handler)
      }
    }
  }
})()

let targetDrag = {
  // 拖拽
  isDown: false,
  position: {
    x: 0,
    y: 0,
  },
}

// x轴拖动回调 鼠标按下
const scrollMousedown = (event: any) => {
  targetDrag.isDown = true
  targetDrag.position.x = event.pageX
  targetDrag.position.y = event.pageY
  event.target.style.userSelect = 'none'
}
// x轴拖动回调  鼠标释放
const scrollMouseup = () => {
  targetDrag.isDown = false
  targetDrag.position.x = 0
  targetDrag.position.y = 0
}
// x轴拖动回调  鼠标移动

const scrollMousemove = () => {
  // console.log(event, el)
  // todo
}

const mounted = function (el: any) {
  // 鼠标按下
  on(el, 'mousedown', scrollMousedown)
  // 鼠标释放
  on(el, 'mouseup', scrollMouseup)
  // 鼠标拖拽
  on(el, 'mousemove', (event: any) => {
    let moveX = targetDrag.position.x - event.pageX
    // let moveY = targetDrag.position.y - event.pageY
    targetDrag.position.x = event.pageX
    // targetDrag.position.y = event.pageY
    if (targetDrag.isDown) {
      el.scrollLeft = el.scrollLeft + moveX
      // el.scrollTop = el.scrollTop + moveY
    }
  })
}

const beforeUnmount = function (el: any) {
  off(el, 'mousedown', scrollMousedown)
  off(el, 'mouseup', scrollMouseup)
  off(el, 'mousemove', scrollMousemove)
  // 清空
  targetDrag = {
    // 拖拽
    isDown: false,
    position: {
      x: 0,
      y: 0,
    },
  }
}
export const scrollX = {
  mounted,
  beforeUnmount,
  // for vue2
  bind: mounted,
  unbind: beforeUnmount,
}
export default {
  install(app:AnyObject){
    app.directive('scrollX',scrollX)
  }
}
