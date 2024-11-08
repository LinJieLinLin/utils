/**
 * @module
 * @author linjielinlin 993353454@qq.com
 * @date 2022-05-22 00:41:33
 * @description 微信小程序/uniapp/taro公共函数
 */

/* eslint-disable no-constant-condition,no-undef */
import Loading from './class/Loading'
import Throttle from './class/Throttle'
import { decode, encode } from './encrypt/base64'
import {
  isJson,
  safeData,
  setUrlParams,
  blobToFile,
  dataURLtoBlob,
  sleep,
} from './index'
import { getEnv, getUrlParamObj, getInfo } from './base'
import { AnyFn, AppConfig, Bool, Info, UploadFile, AnyObject } from './types'

declare var uni: any
declare var wx: any
declare var taro: any
declare var uniCloud: any
declare var getCurrentPages: any

let app: AnyObject = {}
let appConfig: AppConfig = {
  localEncrypt: false,
}
let isH5 = false
// #ifdef  H5
isH5 = true
// #endif
let ljCloud: AnyObject = {}

if (typeof uni !== 'undefined') {
  app = uni
} else if (typeof taro !== 'undefined') {
  app = taro
} else if (typeof wx !== 'undefined') {
  app = wx
}
// 初始化loading
const L = new Loading(() => {
  app.showLoading({
    mask: true,
  })
}, app.hideLoading)
// 函数节流
const throttle = new Throttle()
/**
 * @description 默认拦截函数obj
 */
const interceptors = {
  request(argData: any) {
    L.loading(1)
    return argData
  },
  async response(argData: any) {
    L.loading()
    return argData
  },
}

/**
 * @description 初始化配置(uniCloud/request拦截)
 * @function
 * @param {any} argConfig
 * @param {boolean} argConfig.localEncrypt 本地缓存是否加密
 */
export const init = (argConfig?: AppConfig) => {
  console.debug('argConfig', argConfig)
  Object.assign(appConfig, argConfig)
  // 初始化uniCloud
  if (typeof uniCloud !== 'undefined' && appConfig?.uniCloud?.clientSecret) {
    ljCloud = uniCloud.init(appConfig.uniCloud)
    console.debug('ljCloud:', ljCloud)
  }
  // 初始化拦截器
  if (argConfig?.requestCb && argConfig?.responseCb) {
    setRequest(argConfig?.requestCb, argConfig?.responseCb)
  }
}
/**
 * @description 获取unicloud DB,返回实例
 * @function
 */
export const getDb = () => {
  if (ljCloud.database) {
    return ljCloud.database()
  } else {
    console.debug('ljCloud.database() is undefined')
    return {}
  }
}
/**
 * @description 显示loading
 * @function
 */
export const showLoading = () => {
  L.loading(1)
}
/**
 * @description 隐藏loading
 * @function
 */
export const hideLoading = () => {
  L.loading()
}
/**
 * @description 修改设置拦截函数
 * @function
 * @param {function} argRequest 请求拦截
 * @param {function} argResponse 响应拦截
 */
export const setRequest = (argRequest: AnyFn, argResponse: AnyFn) => {
  if (typeof argRequest === 'function') {
    interceptors.request = (argData) => {
      L.loading(1)
      return argRequest(argData)
    }
  }
  if (typeof argResponse === 'function') {
    interceptors.response = (argData) => {
      L.loading()
      return argResponse(argData)
    }
  }
}
/**
 * @description 使用ljapi
 * @function
 * @param {AnyObject} argOption 传入参数
 * @returns {argOption} 返回修改后的参数
 */
export const ljApiFn = (argOption: AnyObject): AnyObject => {
  argOption.params = Object.assign(
    {
      path: argOption.url,
      data: safeData(argOption, 'params.data', {}),
    },
    JSON.parse(getEnv('VUE_APP_LJAPIC'))
  )
  argOption.params.type = getEnv('VUE_APP_LJAPITYPE')
  argOption.url = getEnv('VUE_APP_LJAPIURL')
  // argOption.method = 'GET'
  argOption.method = 'POST'
  return argOption
}
/**
 * @description 封装小程序request
 * @function
 * @param {AnyObject} argOption http配置
 * @param {Bool} argIsMock 是否使用mock
 * @returns {promise}
 */
export const request = async (
  argOption: AnyObject,
  argIsMock: Bool = false
): Promise<any> => {
  let apiUrl = argOption.url
  if (getEnv('VUE_APP_LJAPITYPE') === 'get' || argIsMock) {
    argOption = ljApiFn(argOption)
  } else {
    argOption = (await interceptors.request(argOption)) as AnyObject
  }
  return new Promise((resolve, reject) => {
    const config = {
      url: argOption.url,
      method: argOption.method || 'GET',
      data: argOption.params,
      success(res: AnyObject = { data: {} }) {
        console.debug('response：', res)
        if (!argIsMock && getEnv('VUE_APP_LJAPITYPE') === 'set') {
          argOption.url = apiUrl
          argOption.params.data = JSON.stringify(res.data)
          request(argOption, 1)
        }
        res.config = argOption.config || {}
        return resolve(interceptors.response(res))
      },
      fail(err: unknown) {
        return reject(interceptors.response(err))
      },
    }
    Object.assign(config, argOption.config)
    app.request(config)
  })
}
/**
 * @description 图片上传 单图/多图
 * @function
 * @param {object} argOption 参数配置
 * @returns {promise} 上传回调
 */
export const uploadImg = async (argOption: AnyObject): Promise<any> => {
  var error: unknown, filePath
  argOption.config = argOption.config || {}
  var data: UploadFile = {
    url: argOption.params.url,
    filePath: '',
    name: argOption.params.name || 'file',
    formData: null,
    header: argOption.config.header || {},
  }
  filePath = argOption.params.filePath
  const uploadOne = async (argPath: string) => {
    data.filePath = argPath
    let res: AnyObject = await P('uploadFile', data).catch((err) => {
      error = err
    })
    // #ifdef  H5
    URL.revokeObjectURL(argPath)
    // #endif
    if (res) {
      res.data = JSON.parse(res.data)
      return interceptors.response(res)
    } else {
      return Promise.reject(error)
    }
  }

  delete argOption.params.url
  delete argOption.params.filePath
  delete argOption.params.name
  delete argOption.config.header['content-type']

  argOption = interceptors.request(argOption)
  data.formData = argOption.params
  data.header = argOption.config.header || {}
  // 单张上传
  if (typeof filePath === 'string') {
    return uploadOne(filePath)
  } else {
    const temUploadFn = filePath.map(uploadOne)
    let res = await Promise.all(temUploadFn).catch((err) => {
      error = err
    })
    if (res) {
      return res
    } else {
      return Promise.reject(error)
    }
  }
}

/**
 * @function
 * @description 请求云函数
 * @param {object} argOption
 * @param {string} argOption.name 云函数名
 * @param {object} argOption.params 参数
 * @param {object} argOption.config 请求配置
 * }
 */
export const requestCloud = async (argOption: AnyObject) => {
  argOption = interceptors.request(argOption) as AnyObject
  let e
  let res = await ljCloud
    .callFunction({
      name: argOption.name,
      data: argOption.params,
    })
    .catch((err: AnyObject) => {
      e = err
    })
  if (!res) {
    res = e
  }
  res.config = argOption.config || {}
  return interceptors.response(res)
}
/**
 * @function
 * @description 检查是否有更新
 */
export const checkUpdate = () => {
  console.debug('checking update')
  if (!safeData(app, 'getUpdateManager')) {
    return
  }
  const updateManager = app.getUpdateManager()
  updateManager.onUpdateReady(function () {
    app.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res: AnyObject) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      },
    })
  })
}
/**
 * @function
 * @description 检查用户授权状态，未授权弹出授权，(userInfo除外)，将拿到的权限放在authSetting 中
 * @param {string} argSet 要检查的权限,userInfo时：已授权会返回userInfo数据
 * @returns {promise}
 */
export const checkSetting = (argSet: string): Promise<any> => {
  app.removeStorage({
    key: 'authSetting',
  })
  return new Promise(function (resolve, reject) {
    app.getSetting({
      success(res: AnyObject) {
        app.setStorageSync('authSetting', res.authSetting)
        if (!res.authSetting['scope.' + argSet]) {
          if (argSet === 'userInfo') {
            return reject(new Error('未授权用户信息'))
          }
          app.authorize({
            scope: 'scope.' + argSet,
            success(rs: unknown) {
              return resolve(rs)
            },
            fail(err: unknown) {
              return reject(err)
            },
          })
        } else {
          if (argSet === 'userInfo') {
            app.getUserInfo({
              success: (res: unknown) => {
                return resolve(res)
              },
              fail: (err: unknown) => {
                return reject(err)
              },
            })
          } else {
            return resolve(res)
          }
        }
      },
      fail(err: unknown) {
        return reject(err)
      },
    })
  })
}

/**
 * @description 获取地理位置 (类型，)
 * @function
 * @param {string} argType 类型
 * @param {boolean} argAltitude 是否高精度
 * @returns {promise}
 */
export const getLocation = (
  argType: string = 'gcj02',
  argAltitude: boolean = false
): Promise<any> => {
  const location = () => {
    return new Promise(function (resolve, reject) {
      app.getLocation({
        altitude: argAltitude,
        type: argType,
        success: (res: unknown) => {
          return resolve(res)
        },
        fail: (err: unknown) => {
          return reject(err)
        },
      })
    })
  }
  const re = async () => {
    try {
      await checkSetting('userLocation')
      const re = await location()
      return re
    } catch (err: unknown) {
      if (typeof err === 'object' && (err as AnyObject).errMsg) {
        app.show({
          title: '您已拒绝地理位置授权,可以在设置中重新打开',
          icon: 'none',
        })
      }
      return Promise.reject(err)
    }
  }
  return re()
}

/**
 * @description 回到顶部/某个位置
 * @function
 * @param {number} scrollTop 滚动距离
 * @param {number} duration 时间
 * @param {any} ...arg 其他参数selector/offsetTop/success/fail/complete
 * @returns {promise}
 */
export const scrollTop = (
  scrollTop: number = 0,
  duration: number = 0,
  ...arg: any[]
) => {
  return P('pageScrollTo', {
    scrollTop: scrollTop,
    duration: duration,
    ...arg,
  })
}

/**
 * @description toast默认为文字提示,默认推迟320ms显示
 * @function
 * @param {string} argTitle title
 * @param {object} argOption 配置
 * argOption.icon:'图标',
 * argOption.delay: '延时显示ms'
 * argOption.duration："显示时间"
 * @returns {promise}
 */
export const toast = async (
  argTitle: string,
  argOption: AnyObject = {
    icon: 'none',
    delay: 0,
    duration: 1500,
  }
): Promise<any> => {
  argOption.title = argTitle
  if (argOption.delay) {
    await sleep(argOption.delay)
  }
  hideLoading()
  return P('showToast', argOption)
}

/**
 * @function
 * @description 设置标题
 * @param  {string} argTitle 标题
 */
export const setTitle = (argTitle: string) => {
  app.setNavigationBarTitle &&
    app.setNavigationBarTitle({
      title: argTitle,
    })
}

/**
 * @function
 * @description uniapp跳到特定页面
 * @param  {string} argPage 标题
 * @param  {object} argParams url参数
 * @param  {string|number} argType 跳转类型 switchTab reload redirectTo reLaunch navigateTo
 * @param {boolean} argForce 是否取消节流非H5生效
 */
export const toPage = (
  argPage: string = '',
  argParams: AnyObject = {},
  argType: string | number = '',
  argForce: Bool = false
) => {
  const toPageFn = () => {
    console.debug('toPage params:', argPage, argParams, argType, argForce)
    // 后退处理
    let pages =
      (typeof getCurrentPages !== 'undefined' && getCurrentPages()) || []
    if (!argPage || argPage === 'back') {
      if (isH5) {
        window.history.go(+('-' + (argType || 1)))
      } else {
        // -1时返回首页
        if (pages.length > 1 && argType !== '-1') {
          app.navigateBack({
            delta: +argType || 1,
          })
        } else {
          app.reLaunch({
            url: '/pages/index/index' + setUrlParams(argParams),
          })
        }
      }
      return
    }
    // 每次进入首页都重载
    if (argPage === 'index' || argPage === '/pages/index/index') {
      app.reLaunch({
        url: '/pages/' + argPage + '/index' + setUrlParams(argParams),
      })
      return
    }
    let temUrl = '/pages/' + argPage + '/index' + setUrlParams(argParams)
    // 匹配绝对路径和url
    if (argPage[0] === '/' || /http:\/\/|https:\/\//.test(argPage)) {
      temUrl = argPage + setUrlParams(argParams)
    }
    if (isH5 && /http:\/\/|https:\/\//.test(argPage)) {
      temUrl = argPage + setUrlParams(argParams)
      window.location.replace(temUrl)
      return
    }
    switch (argType) {
      case 'switchTab':
        app.switchTab({
          url: temUrl,
        })
        break
      case 'reload':
        app.reLaunch({
          url: temUrl,
        })
        break
      case 'redirectTo':
        if (isH5) {
          window.location.replace('#' + temUrl)
        } else {
          app.redirectTo({
            url: temUrl,
          })
        }
        break
      case 'reLaunch':
        app.reLaunch({
          url: temUrl,
        })
        break
      default:
        // 超10层处理
        if (!isH5 && pages.length >= 10) {
          app.redirectTo({
            url: temUrl,
          })
          return
        }
        app.navigateTo &&
          app.navigateTo({
            url: temUrl,
          })
        break
    }
  }
  if (isH5 || argForce) {
    toPageFn()
  } else {
    throttle.throttle(toPageFn)
  }
}

/**
 * @function
 * @description 获取当前页面数据obj
 * @returns {object}
 */
export const getCurrentPage = (): AnyObject => {
  let pages =
    (typeof getCurrentPages !== 'undefined' && getCurrentPages()) || []
  return pages[pages.length - 1] || {}
}

/**
 * @function
 * @description 获取当前页url
 * @param {boolean} argWithParams 是否附带参数
 * @returns {string}
 */
export const getCurrentPageUrl = (argWithParams: boolean = true): string => {
  let currentPage = getCurrentPage()
  let url: string = currentPage.route || ''
  let options = currentPage.options || {}
  if (argWithParams) {
    url += setUrlParams(options)
  }
  return url || ''
}

/**
 * @function
 * @description 获取微信登录code
 * @returns {promise}
 */
export const login = (): Promise<any> => {
  return new Promise(function (resolve, reject) {
    app.login({
      timeout: 5000,
      success: function (rs: AnyObject) {
        app.setStorageSync('code', rs.code)
        console.debug('micro login info:', rs)
        return resolve(rs)
      },
      fail: function (err: unknown) {
        toast('请检查网络')
        return reject(err)
      },
    })
  })
}
/**
 * @function
 * @description 获取用户信息
 * @param {object} argData 用户数据（点按钮授权时传入）
 * @returns {promise}
 */
export async function getUserInfo(argData: AnyObject): Promise<any> {
  L.loading(1)
  const _login = await login().catch((err) => {
    console.error(err)
    L.loading()
  })
  const setUserInfo = (argData: AnyObject) => {
    L.loading()
    return argData
  }
  if (argData) {
    if (argData.target) {
      argData.target.code = _login.code
    }
    return setUserInfo(argData.target)
  } else {
    const _checkSetting = await checkSetting('userInfo').catch((err) => {
      console.error('unAuthor', err)
      L.loading()
    })
    _checkSetting.code = _login.code
    return setUserInfo(_checkSetting)
  }
}

/**
 * @function
 * @description 下载图片到手机
 * @param {array} argImgList 图片url,数组或字符串
 * @param {boolean} argIsLocal 是否是本地临时文件路径或永久文件路径
 * @returns {promise} 出错时无promise
 */
export const downloadImgs = async (
  argImgList: unknown,
  argIsLocal: Bool = false
): Promise<any> => {
  try {
    let isAuth = true
    let res = null
    let imgList: string[] = []
    if (argImgList && typeof argImgList === 'string') {
      imgList = [argImgList]
    }
    imgList = argImgList as string[]
    if (!imgList.length) {
      console.error('参数有误！')
      return Promise.reject(false)
    }
    L.loading(1)
    await checkSetting('writePhotosAlbum').catch((err) => {
      console.error('writePhotosAlbum error:', err)
      isAuth = false
      L.loading()
    })
    // 拒绝授权处理
    if (!isAuth) {
      res = await P('showModal', {
        title: '提示',
        content: '需要您授权保存相册',
        showCancel: false,
        async success() {
          const res = await P('openSetting')
          if (res.authSetting['scope.writePhotosAlbum']) {
            app.showModal({
              title: '提示',
              content: '已获得权限，请重新操作！',
              showCancel: false,
            })
            return true
          } else {
            app.showModal({
              title: '提示',
              content: '未获得权限，将无法保存到相册哦~',
              showCancel: false,
            })
            return false
          }
        },
      })
    }
    for (const img of imgList) {
      let tempFilePath = img
      if (!argIsLocal) {
        res = await P('downloadFile', {
          url: img,
        })
        tempFilePath = res.tempFilePath
      }
      let saveFail = false
      await P('saveImageToPhotosAlbum', {
        filePath: tempFilePath,
      }).catch((err) => {
        saveFail = true
        console.error('saveImageToPhotosAlbum error:', err)
      })
      if (saveFail) {
        L.loading()
        toast('保存到相册失败，请重试！')
        return Promise.reject(false)
      }
    }
    L.loading()
    toast('下载完成！')
    return Promise.resolve(true)
  } catch (e) {
    console.log(e)
    return Promise.reject(false)
  }
}
/**
 * @function
 * @description 上传图片，返回临时图片路径
 * @param {object} argOptions
 * argOptions.count: 9,最多可以选择的图片张数
 * argOptions.sizeType: ['original', 'compressed'], 所选的图片的尺寸
 * argOptions.sourceType: ['album', 'camera'] album ,从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
 * argOptions.disCompress: false 是否关闭图片压缩，默认开启
 * } 外加选择图片chooseImage配置
 * @param {number} argMb 超过多少M压缩，默认1M(仅支持jpg)
 * @param {number} argQuality 压缩质量默认80
 * @param {number} argMaxSize 图片最长边默认1920
 * @returns {promise} 返回临时图片路径[{tempFilePath:'临时路径',size: '不压缩时返回'}]
 */
export const uploadImgs = async (
  argOptions: AnyObject = {
    // 最多可以选择的图片张数
    count: 9,
    // 所选的图片的尺寸
    sizeType: ['original', 'compressed'],
    // album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
    sourceType: ['album', 'camera'],
    // 是否关闭图片压缩，默认开启
    disCompress: false,
    // reType:'base64'
  },
  argMb: number = 1,
  argQuality: number = 90,
  argMaxSize: number = 1920
): Promise<any> => {
  var maxSize = argMaxSize || 1920
  let err = ''
  const res = await P('chooseImage', {
    count: argOptions.count || 9,
    sizeType: argOptions.sizeType || ['original', 'compressed'],
    sourceType: argOptions.sourceType || ['album', 'camera'],
  }).catch((error) => {
    err = error
  })
  if (!res) {
    console.error('chooseImage error:', err)
    return Promise.reject(err)
  }
  console.debug('select files：', res)
  showLoading()
  // 按需压缩
  const tempFiles = res.tempFiles
  // 压缩图片
  const compressImage = async (argData: AnyObject) => {
    if (argData.size > argMb * 1024 * 1024) {
      console.debug('compressImage params：', argData)
      if (!isH5 && !argOptions.disCompress) {
        return P('compressImage', {
          src: argData.path,
          quality: argQuality,
        })
      }
      const getBase64Image = async (argData: any) => {
        if (argData && !argData.img) {
          return { path: null, file: null }
        }
        console.debug('canvas compress start')
        var canvas = document.createElement('canvas')
        var img = argData.img
        let scaleRate
        if (img.width > img.height && img.width > maxSize) {
          scaleRate = img.width / maxSize
          img.width = maxSize
          img.height = img.height / scaleRate
        }
        if (img.height > img.width && img.height > maxSize) {
          scaleRate = img.height / maxSize
          img.height = maxSize
          img.width = img.width / scaleRate
        }
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext('2d')
        ctx && ctx.drawImage(img, 0, 0, img.width, img.height)
        let rate = argQuality / 100
        // base64Url
        var base64Url = canvas.toDataURL('image/jpeg', rate)
        if (argOptions.reType === 'base64') {
          return {
            path: base64Url,
            file: null,
          }
        } else {
          let blob = dataURLtoBlob(base64Url)
          var file = blobToFile(blob, argData.name)
          console.debug(
            'old:',
            argData.size / 1024,
            'new:',
            base64Url.length / 1024,
            'fileSize:',
            file.size / 1024,
            file,
            typeof file
          )
          return {
            path: base64Url,
            file: file,
          }
        }
      }

      const loadImg = async (argData: AnyObject) => {
        return new Promise((resolve, reject) => {
          var img = new Image()
          img.src = argData.path
          img.onload = function () {
            return resolve({
              img,
              name: argData.name || '',
            })
          }
          img.onerror = function (error) {
            return reject(error)
          }
        })
      }

      let file = await getBase64Image(await loadImg(argData))
      if (safeData(file, 'file.size') > argMb * 1024 * 1024) {
        console.debug('二次压缩', file)
        // 控制质量
        argQuality = argQuality / 2
        file = await getBase64Image(await loadImg(file))
      }
      return Promise.resolve({
        // 临时路径
        tempFilePath: file.path,
        file: file.file,
        fileName: argData.name || '',
        // 大小
        size: safeData(file, 'file.size', null),
      })
    }
    return Promise.resolve({
      tempFilePath: argData.path,
      size: argData.size,
      fileName: argData.name || '',
      file: argData,
    })
  }

  const tempFilePathsFn = tempFiles.map(compressImage)
  let tempFilePaths: void | any[] = []
  tempFilePaths = await Promise.all(tempFilePathsFn).catch((error) => {
    console.error('compressImage error:', error)
    err = error
  })
  hideLoading()
  if (!tempFilePaths) {
    return Promise.reject(err)
  }
  return Promise.resolve(tempFilePaths)
}
/**
 * @function
 * @description 检测浏览器状态，系统状态 *
 * @returns {object} {
 * ua: ua,
 * platform: 平台,
 * isMobile: 移动端,
 * isWin: winPC端,
 * isIphone: iphone,
 * isIpad: ipad,
 * isMac: mac,
 * isAppleMobile: 苹果移动端webview
 * isSafari: Safari浏览器,
 * isIos: Ios平台,
 * isAndroid: android平台,
 * isIE: 显示8 9 10, true为11以上
 * ...
 * }
 */
export const getSystemInfo = (): AnyObject => {
  if (typeof app === 'object' && safeData(app, 'getSystemInfoSync')) {
    let info: AnyObject = app.getSystemInfoSync()
    let defInfo = getInfo()
    defInfo.platform = info.platform || defInfo.platform
    info.iosVersion =
      info.isIos && info.system.match(/\d./) && info.system.match(/\d./)[0]
    return Object.assign(info, defInfo)
  }
  return getInfo()
}

/**
 * @function
 * @description 获取storage的值，默认将json转为obj
 * @param {string} argKey 要获取的key
 * @param {boolean} argNoJson true时不自动转换JSON字符串
 * @returns {promise} key对应的数据
 */
export const getStorage = async (
  argKey: string,
  argNoJson: boolean = false
): Promise<any> => {
  let res = await P('getStorage', {
    key: argKey,
  })
  if (appConfig.localEncrypt) {
    res = decode(res.data)
  }
  if (!res || !res.data) {
  }
  // 默认转义JSON字符串
  if (!argNoJson && isJson(res.data)) {
    res.data = JSON.parse(res.data)
  }
  return res.data || res || ''
}

/**
 * @function
 * @description 获取storage的值，默认将json转为obj
 * @param {string} argKey 要获取的key
 * @param {boolean} argNoJson true时不自动转换JSON字符串
 * @returns {any} key对应的数据
 */
export const getStorageSync = (
  argKey: string,
  argNoJson: boolean = false
): any => {
  let data = app.getStorageSync(argKey)
  if (appConfig.localEncrypt) {
    data = decode(data)
  }
  // 默认转义JSON字符串
  if (!argNoJson && isJson(data)) {
    data = JSON.parse(data)
  }
  return data
}

/**
 * @function
 * @description 退出登录或登录失效，清除本地数据
 * @param {string} argKey 要删除的key,不填为删除全部
 * @param {string} argExtraKey:额外保留的key如：'vuex,ticket'
 * @param {boolean} isForce 是否强制删除全部
 */
export const clearStorageSync = async (
  argKey: string = '',
  argExtraKey: string = '',
  isForce: boolean = false
) => {
  if (argKey) {
    app.removeStorageSync(argKey)
  } else if (isForce) {
    app.clearStorageSync()
  } else {
    let res = await P('getStorageInfo')
    res.keys.forEach((v: string) => {
      if (!isForce) {
        let extraKey = ',' + argExtraKey + ','
        if (extraKey.match(',' + v + ',')) {
          return
        }
      }
      app.removeStorageSync(v)
    })
  }
}

/**
 * @function
 * @description 设置storage的值，默认将obj转为json
 * @param {string} argKey 要设置的key
 * @param {string|AnyObject} argData 要设置的值
 * @returns {promise} key对应的数据
 */
export const setStorage = async (
  argKey: string,
  argData: string | AnyObject
): Promise<any> => {
  let temData = argData
  if (appConfig.localEncrypt) {
    if (typeof argData === 'object') {
      argData = JSON.stringify(argData)
    }
    temData = encode(argData)
  }
  const res = await P('setStorage', {
    key: argKey,
    data: temData,
  }).catch((err) => {
    console.error('setStorage', err)
  })
  return res.data || res || ''
}

/**
 * @function
 * @description wx/taro/uni api转Promise
 * @param {string} argApi 需要转promise的API名称
 * @param {object} argOptions {} api对应的配置，除了success和fail
 * @returns {promise}
 */
export const P = (argApi: string, argOptions: AnyObject = {}): Promise<any> => {
  return new Promise(function (resolve, reject) {
    if (!argApi && argOptions.success) {
      return argOptions.success(resolve, reject)
    }
    const options = {
      success: resolve,
      fail: reject,
    }
    Object.assign(options, argOptions)
    if (app[argApi]) {
      app[argApi](options)
    } else {
      return reject('无此方法')
    }
  })
}

/**
 * 描述
 * @function
 * @description 微信实时日志记录
 * @date 2019-09-26
 * @returns {AnyObject}
 */
export const wxLog = (): AnyObject => {
  // logLevel 1 error 2 warn 3 info 4 debug
  const logLevel = +getStorageSync('logLevel')
  switch (logLevel) {
    case 1:
      console.warn = () => {}
    // eslint-disable-next-line no-fallthrough
    case 2:
      console.info = () => {}
    // eslint-disable-next-line no-fallthrough
    case 3:
      console.log = () => {}
    // eslint-disable-next-line no-fallthrough
    case 4:
    case 0:
    default:
      break
  }
  if (!wx) {
    return {}
  }
  let log: AnyObject | null = null
  if (wx) {
    log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
  }
  return {
    debug() {
      if (!log) return
      log.debug.apply(log, arguments)
    },
    info() {
      if (!log) return
      log.info.apply(log, arguments)
    },
    warn() {
      if (!log) return
      log.warn.apply(log, arguments)
    },
    error() {
      if (!log) return
      log.error.apply(log, arguments)
    },
    setFilterMsg(msg: string) {
      // 从基础库2.7.3开始支持
      if (!log || !log.setFilterMsg) return
      if (typeof msg !== 'string') return
      log.setFilterMsg(msg)
    },
    addFilterMsg(msg: string) {
      // 从基础库2.8.1开始支持
      if (!log || !log.addFilterMsg) return
      if (typeof msg !== 'string') return
      log.addFilterMsg(msg)
    },
  }
}
/**
 * 描述
 * @function
 * @description 小程序云函数调用
 * @param {string} argOption 云函数配置
 * @date 2019-09-26
 * @returns {promise}
 */
export const cloudApi = async (argOption: AnyObject = {}): Promise<any> => {
  if (wx) {
    L.loading(1)
    let error = ''
    const res = await wx.cloud.callFunction(argOption).catch((err: unknown) => {
      toast(`云函数:${argOption.name}调用失败！`)
      error = err as string
    })
    L.loading()
    if (error) {
      return Promise.reject(error)
    }
    return Promise.resolve(res)
  } else {
    return Promise.reject('暂不支持')
  }
}
/**
 * @function
 * @description 富文本格式处理 for 小程序rich-text
 * @param {string} argData 富文本
 * @returns {string}
 */
export const getRichText = (argData: string): string => {
  if (!argData) {
    return ''
  }
  const imgReg = /<img.*?(?:>|\/>)/gi
  const styleReg = /style="([^"]*)"/g
  // 处理空格
  argData = argData.replace(/&nbsp;/g, '\xa0')
  argData = String(argData).replace(imgReg, (match) => {
    let newStyleImg = ''
    // 图片样式保留原来style添加大小限制，若原来img没有设style则直接插进去
    if (!match.match('max-width:100%')) {
      let temStyle = safeData(match.match(styleReg), '0', '')
      if (temStyle) {
        temStyle =
          temStyle.slice(0, temStyle.length - 1) +
          ';max-width:100%;height:auto;"'
        newStyleImg = match.replace(styleReg, temStyle)
      } else {
        newStyleImg = match.replace(
          /<img/gim,
          '<img style="max-width:100%;height:auto;"'
        )
      }
    } else {
      newStyleImg = match
    }
    // #ifdef MP
    // newStyleImg = newStyleImg.replace(/px;/gim, 'rpx;')
    // #endif
    return newStyleImg
  })
  return argData
}
/**
 * @function
 * @description 页面刷新
 */
export const refresh = () => {
  let nowPage = getCurrentPage()
  let options = getUrlParamObj(safeData(nowPage, '$page.fullPath'))
  nowPage.onLoad && nowPage.onLoad(options)
  nowPage.onReady && nowPage.onReady()
  nowPage.onShow && nowPage.onShow()
}

interface GetDomOptions {
  id?: boolean
  dataset?: boolean
  rect?: boolean
  size?: boolean
  scrollOffset?: boolean
  computedStyle?: any[]
  context?: boolean
  properties?: any[]
}
/**
 * @function
 * @description: 获取dom节点相关信息
 * @param {object}  argThis: 当前this,
 * @param {string} argId id/class
 * @param {Boolean} getAll 是否获取全部 true时，返回数组
 * @param {object} argOptions 修改默认返回具体参考：https://uniapp.dcloud.io/api/ui/nodes-info?id=nodesreffields
 * @return: object/array
 */
export const getDom = async (
  argThis: any,
  argId: string,
  getAll: Bool = false,
  argOptions?: GetDomOptions
) => {
  let temOptions: GetDomOptions = {
    id: true,
    dataset: true,
    rect: true,
    size: true,
    scrollOffset: true,
    computedStyle: [],
    context: true,
    properties: [],
  }
  if (isH5) {
    delete temOptions.properties
  }
  if (argOptions) {
    Object.assign(temOptions, argOptions)
  }
  return new Promise((resolve, rejects) => {
    let nodesRef
    let temDom = uni.createSelectorQuery().in(argThis)
    nodesRef = temDom[getAll ? 'selectAll' : 'select'](argId)
    nodesRef
      .fields(temOptions, (res: any) => {
        if (getAll && Array.isArray(res) && res.length) {
          resolve(res)
        }
        if (!getAll && res) {
          resolve(res)
        }
        rejects(res)
      })
      .exec()
  })
}

/**
 * @description APP:返回 uni/wx/taro实例
 * @constant {object}
 */
export const APP = app
/**
 * @description IS_H5:是否为H5
 * @constant {boolean}
 * @default false
 */
export const IS_H5 = isH5
