import { on, off, safeData } from '../base.js';

/**
 * @module directive
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 */
const mounted = function (el, bind) {
    main(el, bind);
};
const beforeUnmount = function (el, bind) {
    main(el, bind, true);
};
const scrollMouseup = (_e, el) => {
    el.dragInfo.isDown = false;
    el.dragInfo.position.x = 0;
    el.dragInfo.position.y = 0;
};
const scrollMousemove = (event, el) => {
    if (el.dragInfo.isDown) {
        const moveX = el.dragInfo.position.x - event.pageX;
        let moveY = el.dragInfo.position.y - event.pageY;
        el.dragInfo.position.x = event.pageX;
        el.dragInfo.position.y = event.pageY;
        if (el.dragInfo.type === 'x') {
            safeData(el, 'scrollLeft', el.scrollLeft + moveX, true);
        }
        else if (el.dragInfo.type === 'y') {
            safeData(el, 'scrollTop', el.scrollTop + moveY, true);
        }
        else {
            safeData(el, 'scrollLeft', el.scrollLeft + moveX, true);
            safeData(el, 'scrollTop', el.scrollTop + moveY, true);
        }
    }
};
const main = function (el, bind, isRemove = false) {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        console.error('isTouch');
        return;
    }
    const scrollMousedown = (event) => {
        el.dragInfo.isDown = true;
        el.dragInfo.position.x = event.pageX;
        el.dragInfo.position.y = event.pageY;
        event.target.style.userSelect = 'none';
        event.preventDefault();
    };
    if (!isRemove) {
        el.dragInfo = {
            type: bind.arg || '',
            isDown: false,
            position: {
                x: 0,
                y: 0,
            },
        };
        if (bind?.arg) {
            bind.arg === 'x' && (el.style.overflowX = 'auto');
            bind.arg === 'y' && (el.style.overflowY = 'auto');
        }
        else {
            el.style.overflow = 'auto';
        }
        el.mouseUp = (event) => {
            scrollMouseup(event, el);
        };
        el.mouseMove = (event) => {
            scrollMousemove(event, el);
        };
        on(el, 'mousedown', scrollMousedown);
        if (globalThis.document) {
            on(globalThis.document, 'mouseup', el.mouseUp);
        }
        else {
            on(el, 'mouseup', el.mouseUp);
        }
        on(el, 'mousemove', el.mouseMove);
    }
    else {
        if (globalThis.document) {
            off(globalThis.document, 'mouseup', el.mouseUp);
        }
        else {
            off(el, 'mouseup', el.mouseUp);
        }
        off(el, 'mousedown', scrollMousedown);
        off(el, 'mousemove', el.mouseMove);
        // @ts-ignore
        el.dragInfo = null;
        // @ts-ignore
        el.mouseMove = null;
        // @ts-ignore
        el.mouseUp = null;
    }
};
/**
 * @description pc滚动条鼠标拖拽指令
 * @example
 * // 注册1
 * import scrollX from 'lj-utils/directive/vScrollX';
 * directives: {
 *   scroll,
 * },
 * // 注册2 for <script setup>
 * import vScroll from 'lj-utils/directive/vScrollX';
 */
const vScroll = {
    mounted,
    beforeUnmount,
    // for vue2
    bind: mounted,
    unbind: beforeUnmount,
};
const name = 'scrollX';

export { vScroll as default, name, vScroll };
