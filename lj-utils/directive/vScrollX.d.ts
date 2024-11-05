/**
 * @module directive
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 */
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
export declare const vScrollX: {
    mounted: (el: HTMLElement) => void;
    beforeUnmount: (el: HTMLElement) => void;
    bind: (el: HTMLElement) => void;
    unbind: (el: HTMLElement) => void;
};
export default vScrollX;