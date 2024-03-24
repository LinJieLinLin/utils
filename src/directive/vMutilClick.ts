import { off, on } from '../base'
const main = function (el: HTMLElement, bind: any, isRemove: boolean = false) {
  const delay = +(el.dataset?.['delay'] || 500)
  const countDef = +(el.dataset?.['count'] || 2)
  const eventName =
    'ontouchstart' in window || navigator.maxTouchPoints > 0
      ? 'touchstart'
      : 'click'
  let count = countDef,
    timer: any

  const onMutilClick = (event: any) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      count = countDef
    }, delay)
    count--
    if (!count) {
      count = countDef
      if (typeof bind.value === 'function') {
        bind.value(event)
      }
    }
  }
  if (!isRemove) {
    on(el, eventName, onMutilClick)
  } else {
    off(el, eventName, onMutilClick)
  }
}

const mounted = function (el: HTMLElement, bind: any) {
  main(el, bind)
}
const beforeUnmount = function (el: HTMLElement, bind: any) {
  main(el, bind, true)
}

/**
 * @description 多次点击指令
 * @example
 * <button
 *    v-mutil-click="clickFn"
 *  >
 *    default:2连击
 *  </button>
 *  * <button
 *    data-count="2"
 *    data-delay="500"
 *    v-mutil-click="clickFn"
 *  >
 *    default:2连击
 *  </button>
 */
export const vMutilClick = {
  mounted,
  beforeUnmount,
  // for vue2
  bind: mounted,
  unbind: beforeUnmount,
}
export default vMutilClick
