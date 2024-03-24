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
export declare const vMutilClick: {
    mounted: (el: HTMLElement, bind: any) => void;
    beforeUnmount: (el: HTMLElement, bind: any) => void;
    bind: (el: HTMLElement, bind: any) => void;
    unbind: (el: HTMLElement, bind: any) => void;
};
export default vMutilClick;
