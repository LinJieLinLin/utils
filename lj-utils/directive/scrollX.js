import { getObj, setObj, safeData } from '../base.js';

/**
 * @module directive
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 */
const on = (function () {
    if (typeof document.addEventListener === 'function') {
        return function (el, event, handler) {
            if (el && event && handler) {
                el.addEventListener(event, handler, false);
            }
        };
    }
    return function (el, event, handler) {
        if (el && event && handler) {
            el.attachEvent('on' + event, handler);
        }
    };
})();
const off = (function () {
    if (typeof document.removeEventListener === 'function') {
        return function (el, event, handler) {
            if (el && event) {
                el.removeEventListener(event, handler, false);
            }
        };
    }
    return function (el, event, handler) {
        if (el && event) {
            el.detachEvent('on' + event, handler);
        }
    };
})();
let dragInfo = getObj('directiveScrollX');
if (!dragInfo || !dragInfo.position) {
    dragInfo = {
        count: 0,
        isDown: false,
        elementList: new WeakMap(),
        position: {
            x: 0,
            y: 0,
        },
    };
    setObj('directiveScrollX', dragInfo);
}
// x轴拖动回调 鼠标按下
const scrollMousedown = (event) => {
    dragInfo.isDown = true;
    dragInfo.position.x = event.pageX;
    dragInfo.position.y = event.pageY;
    event.target.style.userSelect = 'none';
};
// x轴拖动回调  鼠标释放
const scrollMouseup = () => {
    dragInfo.isDown = false;
    dragInfo.position.x = 0;
    dragInfo.position.y = 0;
};
// x轴拖动回调  鼠标移动
const scrollMousemove = (event, el) => {
    // console.log('move', dragInfo)
    const moveX = dragInfo.position.x - event.pageX;
    // let moveY = dragInfo.position.y - event.pageY
    dragInfo.position.x = event.pageX;
    // dragInfo.position.y = event.pageY
    if (dragInfo.isDown) {
        safeData(el, 'scrollLeft', el.scrollLeft + moveX, true);
    }
};
const mounted = function (el) {
    el.style.overflowX = 'auto';
    // window.e = el
    // 鼠标按下
    on(el, 'mousedown', scrollMousedown);
    // 鼠标释放
    if (globalThis.document) {
        on(globalThis.document, 'mouseup', scrollMouseup);
    }
    else {
        on(el, 'mouseup', scrollMouseup);
    }
    let mouseMove;
    mouseMove = (event) => {
        scrollMousemove(event, el);
    };
    dragInfo.elementList.set(el, mouseMove);
    on(el, 'mousemove', mouseMove);
    dragInfo.count++;
};
const beforeUnmount = function (el) {
    dragInfo.count--;
    if (globalThis.document) {
        if (dragInfo.count < 1) {
            off(globalThis.document, 'mouseup', scrollMouseup);
        }
    }
    else {
        off(el, 'mouseup', scrollMouseup);
    }
    off(el, 'mousedown', scrollMousedown);
    off(el, 'mousemove', dragInfo.elementList.get(el));
    dragInfo.elementList.delete(el);
};
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
const vScrollX = {
    mounted,
    beforeUnmount,
    // for vue2
    bind: mounted,
    unbind: beforeUnmount,
};

export { vScrollX as default, vScrollX };
