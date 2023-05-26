/**
 * @module directive
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 */

const on = (function () {
  if (typeof document.addEventListener === 'function') {
    return function (el: any, event: string, handler: any) {
      if (el && event && handler) {
        el.addEventListener(event, handler, false)
      }
    }
  }
  return function (el: any, event: string, handler: any) {
    if (el && event && handler) {
      el.attachEvent('on' + event, handler)
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
  }
  return function (el: any, event: string, handler: any) {
    if (el && event) {
      el.detachEvent('on' + event, handler)
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
    const moveX = targetDrag.position.x - event.pageX
    // let moveY = targetDrag.position.y - event.pageY
    targetDrag.position.x = event.pageX
    // targetDrag.position.y = event.pageY
    if (targetDrag.isDown) {
      el.scrollLeft += moveX
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

/**
 * @description pc滚动条鼠标左右拖拽，用于父节点
 * @example
 * // 注册1
 * import scrollX from './scrollX';
 * directives: {
 *   scrollX: scrollX,
 * },
 * // 注册2 for <script setup>
 * import vScrollX from './scrollX';
 *
 * <view
 *     id="a"
 *     v-scroll-x
 *     style="height: 100px; width: 100vw; background: grey; overflow: auto"
 *   >
 *     <div style="height: 100px; width: 200vw; background: grey">test text</div>
 *   </view>
 */
export const scrollX = {
  mounted,
  beforeUnmount,
  // for vue2
  bind: mounted,
  unbind: beforeUnmount,
}
export default scrollX
