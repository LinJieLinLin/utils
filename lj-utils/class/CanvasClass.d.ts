/**
 * @class
 * @classdesc 小程序canvas海报处理
 */
import { AnyObject } from '../types';
export declare class CanvasClass {
    scale: number;
    ctx: AnyObject;
    width: number;
    height: number;
    basicWidth: number;
    /**
     * @description:
     * @param {object} argCtx canvas上下文
     * @param {number} argWidth canvas宽度
     * @param {number} argBasicWidth 基准宽度
     * @param {number} argScale canvas缩放比例
     */
    constructor(argCtx: AnyObject, argWidth?: number, argBasicWidth?: number, argScale?: number);
    /**
     * @description: 获取正确的单位
     * @param {number} argData
     * @return {number} 返回计算好的值
     */
    getScale(argData: number): number;
    /**
     * @description: 填空文本
     * @param {string} argText
     * @param {number} argX
     * @param {number} argY
     * @param {number} argMaxWidth
     * @param {number} argIsVertical
     * @return {this} 返回class
     */
    fillText(argText: string, argX: number, argY: number, argMaxWidth: number, argIsVertical: number): this;
    /**
     * @description: 填空图片
     * @return {this} 返回class
     */
    drawImage(...argData: any[]): this;
    /**
     * @description: 填空图片
     * @param {number} argW
     * @param {number} argH
     * @param {string} argFileType
     * @return {any} 返回生成的图片
     */
    createPoster(argW: number, argH: number, argFileType?: string): Promise<any>;
    /**
     * @description: 生成海报
     * @param {boolean} argIsCreate 是否已生成
     * @param {number} argW 是否已生成
     * @param {number} argH 是否已生成
     * @param {string} argFileType 生成的文件类型
     * @return {any} 返回生成的图片
     */
    draw(argIsCreate: any, argW: any, argH: any, argFileType?: string): Promise<any>;
}
export default CanvasClass;
