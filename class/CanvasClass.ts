/**
 * @class
 * @classdesc 小程序canvas海报处理
 */

import { sleep } from '../base'
import { P } from '../microApi'
import { AnyObject } from '../types'
class CanvasClass {
  scale = 4
  ctx: AnyObject = {}
  width = 300
  height = 300
  basicWidth = 375
  /**
   * @description:
   * @param {object} argCtx canvas上下文
   * @param {number} argWidth canvas宽度
   * @param {number} argBasicWidth 基准宽度
   * @param {number} argScale canvas缩放比例
   */
  constructor(
    argCtx: AnyObject,
    argWidth: number = 300,
    argBasicWidth: number = 375,
    argScale: number = 4
  ) {
    this.ctx = argCtx
    this.width = argWidth
    this.scale = argScale
    if (argScale) {
      this.basicWidth = argBasicWidth / argScale
      this.ctx.scale(1 / argScale, 1 / argScale)
    }
  }
  /**
   * @description: 获取正确的单位
   * @param {number} argData
   * @return {number} 返回计算好的值
   */
  getScale(argData: number): number {
    const temData = (argData / this.basicWidth) * this.width
    return Math.round(temData) || 0
  }
  /**
   * @description: 填空文本
   * @param {string} argText
   * @param {number} argX
   * @param {number} argY
   * @param {number} argMaxWidth
   * @param {number} argIsVertical
   * @return {this} 返回class
   */
  fillText(
    argText: string,
    argX: number,
    argY: number,
    argMaxWidth: number,
    argIsVertical: number
  ): this {
    if (argX) {
      this.getScale(argX)
    }
    if (!argIsVertical) {
      this.ctx.save()
      if (argMaxWidth) {
        this.ctx.fillText(
          argText,
          this.getScale(argX),
          this.getScale(argY),
          this.getScale(argMaxWidth)
        )
      } else {
        this.ctx.fillText(argText, this.getScale(argX), this.getScale(argY))
      }
      this.ctx.restore()
    } else {
      // todo
    }
    return this
  }
  /**
   * @description: 填空图片
   * @return {this} 返回class
   */
  drawImage(...argData: any[]): this {
    argData = argData.map((v) => {
      if (typeof v === 'number') {
        v = this.getScale(v)
      }
      return v
    })
    this.ctx.save()
    if (argData[4] === 'circle') {
      // console.log('画圆', argData)
      this.ctx.beginPath()
      const r = argData[3] / 2
      const cx = argData[1] + r
      const cy = argData[2] + r
      this.ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      this.ctx.closePath()
      this.ctx.clip()
      argData[4] = argData[3]
      this.ctx.drawImage(...argData)
    } else if (argData[4] === 'circleColor') {
      this.ctx.beginPath()
      const r = argData[3] / 2
      const cx = argData[1] + r
      const cy = argData[2] + r
      this.ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      this.ctx.closePath()
      this.ctx.clip()
      this.ctx.setFillStyle(argData[0])
      // console.error('颜色：', argData[0])
      this.ctx.fill()
    } else {
      this.ctx.drawImage(...argData)
    }
    this.ctx.restore()
    return this
  }
  /**
   * @description: 填空图片
   * @param {number} argW
   * @param {number} argH
   * @param {string} argFileType
   * @return {any} 返回生成的图片
   */
  async createPoster(
    argW: number,
    argH: number,
    argFileType: string = 'jpg'
  ): Promise<any> {
    let error = ''
    const imgRes = await P('canvasToTempFilePath', {
      x: 0,
      y: 0,
      width: this.getScale(argW),
      height: this.getScale(argH),
      destWidth: this.getScale(argW) * 4,
      destHeight: this.getScale(argH) * 4,
      canvasId: this.ctx.canvasId,
      quality: 1,
      fileType: argFileType,
    }).catch((err) => {
      error = err
    })
    if (error) {
      return Promise.reject(error)
    }
    return imgRes.tempFilePath
  }
  /**
   * @description: 生成海报
   * @param {boolean} argIsCreate 是否已生成
   * @param {number} argW 是否已生成
   * @param {number} argH 是否已生成
   * @param {string} argFileType 生成的文件类型
   * @return {any} 返回生成的图片
   */
  async draw(
    argIsCreate: any,
    argW: any,
    argH: any,
    argFileType: string = 'jpg'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ctx.draw(true, async () => {
        if (!argIsCreate) {
          return resolve('')
        }
        await sleep(1000)
        const poster = await this.createPoster(argW, argH, argFileType)
        return resolve(poster)
      })
    })
  }
}
export default CanvasClass
