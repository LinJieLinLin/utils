/**
 * @module directive
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-11 22:07:43
 */
interface DragInfo {
    type: string;
    isDown: boolean;
    position: {
        x: number;
        y: number;
    };
}
interface DElement extends HTMLElement {
    dragInfo: DragInfo;
    mouseUp: (event: MouseEvent) => void;
    mouseMove: (event: MouseEvent) => void;
}
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
export declare const vScroll: {
    mounted: (el: DElement, bind: any) => void;
    beforeUnmount: (el: DElement, bind: any) => void;
    bind: (el: DElement, bind: any) => void;
    unbind: (el: DElement, bind: any) => void;
};
export declare const name = "scrollX";
export default vScroll;
