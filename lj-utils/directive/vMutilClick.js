import { on, off } from '../base.js';

const main = function (el, bind, isRemove = false) {
    const delay = +(el.dataset?.['delay'] || 500);
    const countDef = +(el.dataset?.['count'] || 2);
    const eventName = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        ? 'touchstart'
        : 'click';
    let count = countDef, timer;
    const onMutilClick = (event) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            count = countDef;
        }, delay);
        count--;
        if (!count) {
            count = countDef;
            if (typeof bind.value === 'function') {
                bind.value(event);
            }
        }
    };
    if (!isRemove) {
        on(el, eventName, onMutilClick);
    }
    else {
        off(el, eventName, onMutilClick);
    }
};
const mounted = function (el, bind) {
    main(el, bind);
};
const beforeUnmount = function (el, bind) {
    main(el, bind, true);
};
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
const vMutilClick = {
    mounted,
    beforeUnmount,
    // for vue2
    bind: mounted,
    unbind: beforeUnmount,
};

export { vMutilClick as default, vMutilClick };
