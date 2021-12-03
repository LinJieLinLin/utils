/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2021-11-30 17:50:18
 * @description: 盒子滚动条拖拽用于父节点
 */
const on = (function () {
  if (document.addEventListener) {
    return function (el, event, handler) {
      if (el && event && handler) {
        el.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (el, event, handler) {
      if (el && event && handler) {
        el.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 功能：移除dom绑定的事件
 * 参数：element(dom节点)
 *      event(事件名称)
 *      handler(回调函数)
 * 返回：无
 * */
const off = (function () {
  if (document.removeEventListener) {
    return function (el, event, handler) {
      if (el && event) {
        el.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (el, event, handler) {
      if (el && event) {
        el.detachEvent('on' + event, handler)
      }
    }
  }
})()

let targetDrag = {
  // 托拽
  isDown: false,
  position: {
    x: 0,
    y: 0,
  },
}

// x轴拖动回调 鼠标按下
const scrollMousedown = (event) => {
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

const scrollX = {
  bind: function (el) {
    // 鼠标按下
    on(el, 'mousedown', scrollMousedown)
    // 鼠标释放
    on(el, 'mouseup', scrollMouseup)
    // 鼠标拖拽
    on(el, 'mousemove', (event) => {
      let moveX = targetDrag.position.x - event.pageX
      // let moveY = targetDrag.position.y - event.pageY
      targetDrag.position.x = event.pageX
      // targetDrag.position.y = event.pageY
      if (targetDrag.isDown) {
        el.scrollLeft = el.scrollLeft + moveX
        // el.scrollTop = el.scrollTop + moveY
      }
    })
  },
  unbind: function (el) {
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
  },
}
export default scrollX
