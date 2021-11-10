/**
 * @class
 * @classdesc canvas封装
 * @example
 */
import { sleep } from '../j'
import { P } from '../microApi'
class CanvasClass {
  scale = 4
  ctx = 0
  width = 300
  height = 300
  basicWidth = 375
  /**
   * @description:
   * @param {object} argCtx canvas上下文
   * @return {class}
   */
  constructor(argCtx, argWidth = 300, argBasicWidth = 375, argScale = 4) {
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
  getScale(argData) {
    const temData = (argData / this.basicWidth) * this.width
    return Math.round(temData) || 0
  }
  fillText(argText, argX, argY, argMaxWidth, argIsVertical) {
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
  drawImage(...argData) {
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
   * @description:
   * @param {*}
   * @return {*}
   */
  async draw(argIsCreate, argW, argH, argFileType) {
    return new Promise((resolve, reject) => {
      this.ctx.draw(true, async () => {
        if (!argIsCreate) {
          return resolve()
        }
        await sleep(1000)
        const poster = await this.creatPoster(argW, argH, argFileType)
        return resolve(poster)
      })
    })
  }
  async creatPoster(argW, argH, argFileType = 'jpg') {
    let error
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
}
export default CanvasClass
