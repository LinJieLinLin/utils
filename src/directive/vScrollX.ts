/**
 * @module directive
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 */

import { getObj, safeData, setObj, on, off } from '../base'

interface DragInfo {
  count: number
  isDown: boolean
  elementList: WeakMap<HTMLElement, (event: MouseEvent) => void>
  position: {
    x: number
    y: number
  }
}
let dragInfo: DragInfo = getObj('directiveScrollX') as DragInfo
if (!dragInfo || !dragInfo.position) {
  dragInfo = {
    count: 0,
    isDown: false,
    elementList: new WeakMap(),
    position: {
      x: 0,
      y: 0,
    },
  }
  setObj('directiveScrollX', dragInfo)
}

// x轴拖动回调 鼠标按下
const scrollMousedown = (event: any) => {
  dragInfo.isDown = true
  dragInfo.position.x = event.pageX
  dragInfo.position.y = event.pageY
  event.target.style.userSelect = 'none'
}
// x轴拖动回调  鼠标释放
const scrollMouseup = () => {
  dragInfo.isDown = false
  dragInfo.position.x = 0
  dragInfo.position.y = 0
}
// x轴拖动回调  鼠标移动

const scrollMousemove = (event: MouseEvent, el: HTMLElement) => {
  // console.log('move', dragInfo)
  const moveX = dragInfo.position.x - event.pageX
  // let moveY = dragInfo.position.y - event.pageY
  dragInfo.position.x = event.pageX
  // dragInfo.position.y = event.pageY
  if (dragInfo.isDown) {
    safeData(el, 'scrollLeft', el.scrollLeft + moveX, true)
  }
}
const mounted = function (el: HTMLElement) {
  el.style.overflowX = 'auto'
  // window.e = el

  // 鼠标按下
  on(el, 'mousedown', scrollMousedown)
  // 鼠标释放
  if (globalThis.document) {
    on(globalThis.document, 'mouseup', scrollMouseup)
  } else {
    on(el, 'mouseup', scrollMouseup)
  }
  let mouseMove
  mouseMove = (event: MouseEvent) => {
    scrollMousemove(event, el)
  }
  dragInfo.elementList.set(el, mouseMove)
  on(el, 'mousemove', mouseMove)
  dragInfo.count++
}

const beforeUnmount = function (el: HTMLElement) {
  dragInfo.count--
  if (globalThis.document) {
    if (dragInfo.count < 1) {
      off(globalThis.document, 'mouseup', scrollMouseup)
    }
  } else {
    off(el, 'mouseup', scrollMouseup)
  }
  off(el, 'mousedown', scrollMousedown)
  off(el, 'mousemove', dragInfo.elementList.get(el))
  dragInfo.elementList.delete(el)
}

/**
 * @description pc滚动条鼠标左右拖拽，用于父节点
 * @example
 * // 注册1
 * import scrollX from 'lj-utils/directive/vScrollX';
 * directives: {
 *   scrollX,
 * },
 * // 注册2 for <script setup>
 * import vScrollX from 'lj-utils/directive/vScrollX';
 *
 * <view
 *     id="a"
 *     v-scroll-x
 *     style="height: 100px; width: 100vw; background: grey; overflow: auto"
 *   >
 *     <div style="height: 100px; width: 200vw; background: grey">test text</div>
 *   </view>
 */
export const vScrollX = {
  mounted,
  beforeUnmount,
  // for vue2
  bind: mounted,
  unbind: beforeUnmount,
}
export default vScrollX
