/*
 * @Author: your name
 * @Date: 2020-04-07 09:54:50
 * @LastEditTime: 2020-07-27 16:21:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \uni-demo\src\utils\microApi.js
 */
/* eslint-disable no-constant-condition,no-undef */
import Loading from './class/Loading'
import Throttle from './class/Throttle'
import Counter from './class/Counter'
import {
  sleep,
  safeData,
  isJson,
  setUrlParams,
  dataURLtoBlob,
  blobToFile,
} from './j'
// import { decode, encode } from './encrypt/crypto'
import { decode, encode } from './encrypt/base64'
import { getObj } from './struct'
import store from '../store'
let frame = ''
let app = {}
let ljCloud = ''
const appConfig = getObj('config') || {}
if (typeof uniCloud !== 'undefined' && appConfig.uniCloud) {
  ljCloud = uniCloud.init(appConfig.uniCloud)
}

if (typeof uni !== 'undefined') {
  app = uni
  frame = 'uni'
} else if (typeof taro !== 'undefined') {
  app = taro
  frame = 'taro'
} else if (typeof wx !== 'undefined') {
  app = wx
  frame = 'wx'
}

// 初始化loading
const L = new Loading(() => {
  app.showLoading({ mask: true })
}, app.hideLoading)
// 函数节流
const throttle = new Throttle()

/**
 * @module
 * @author linj
 * @description 微信小程序公共函数
 */
/**
 * @static
 * @description 默认拦截函数obj
 */
const interceptors = {
  request(argData) {
    L.loading(1)
    return argData
  },
  response(argData) {
    L.loading()
    return argData
  },
}
export const showLoading = () => {
  L.loading(1)
}
export const hideLoading = () => {
  L.loading()
}
/**
 * @description 修改设置拦截函数
 * @function
 * @param {function} argRequest 请求拦截
 * @param {argResponse} argRequest 响应拦截
 */
export const setRequest = (argRequest, argResponse) => {
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
 * @description 封装小程序request
 * @function
 * @param {object} argOption http配置
 * @returns {promise}
 */
export const requestOld = (argOption) => {
  argOption = interceptors.request(argOption)
  return new Promise((resolve, reject) => {
    const config = {
      url: argOption.url,
      method: argOption.method || 'GET',
      data: argOption.params,
      success(res = {}) {
        res.config = argOption.config || {}
        res = interceptors.response(res, resolve, reject)
        if (res && res.cb) {
          return res.cb(resolve, reject)
        }
        if (res && res.reject) {
          return reject(res.data || res)
        } else {
          return resolve(res)
        }
      },
      fail(err) {
        interceptors.response(err)
        return reject(err)
      },
    }
    Object.assign(config, argOption.config)
    app.request(config)
  })
}
/**
 * @description 封装小程序request
 * @function
 * @param {object} argOption http配置
 * @returns {promise}
 */
export const request = async (argOption) => {
  argOption = await interceptors.request(argOption)
  return new Promise((resolve, reject) => {
    const config = {
      url: argOption.url,
      method: argOption.method || 'GET',
      data: argOption.params,
      success(res = {}) {
        console.log('响应数据：', res)
        res.config = argOption.config || {}
        res = interceptors.response(res, resolve, reject)
        if (res && res.cb) {
          return res.cb(resolve, reject)
        }
        if (res && res.reject) {
          return reject(res.data || res)
        } else {
          return resolve(res)
        }
      },
      fail(err) {
        interceptors.response(err)
        return reject(err)
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
export const uploadImg = async (argOption) => {
  var error, filePath
  var data = {
    url:
      argOption.params.url ||
      store.state.BaseUrl + store.state.BasePath + '/common/uploadImage',
    filePath: argPath,
    name: argOption.params.name || 'file',
    formData: null,
    header: argOption.config.header || {},
  }
  filePath = argOption.params.filePath
  const uploadOne = async (argPath) => {
    data.filePath = argPath
    let res = await P('uploadFile', data).catch((err) => {
      error = err
    })
    // #ifdef  H5
    URL.revokeObjectURL(argPath)
    // #endif
    if (res) {
      res = interceptors.response(res)
      return res
    } else {
      return Promise.reject(error)
    }
  }

  delete argOption.params.url
  delete argOption.params.name

  argOption = interceptors.request(argOption)
  data.formData = argOption.params
  // 单张上传
  if (typeof filePath === 'string') {
    return uploadOne(filePath)
  } else {
    const temUploadFn = filePath.map(uploadOne)
    res = await Promise.all(temUploadFn).catch((err) => {
      error = err
    })
    if (res) {
      return res
    } else {
      return Promise.reject(error)
    }
  }
}

export const requestCloud = (argOption) => {
  argOption = interceptors.request(argOption)
  return new Promise((resolve, reject) => {
    return ljCloud
      .callFunction({
        name: argOption.name,
        data: argOption.params,
      })
      .then((res) => {
        res.config = argOption.config || {}
        res = interceptors.response(res, resolve, reject)
        if (res && res.cb) {
          return res.cb(resolve, reject)
        }
        if (res && res.reject) {
          return reject(res.data || res)
        } else {
          return resolve(res)
        }
      })
      .catch((err) => {
        interceptors.response(err)
        return reject(err)
      })
  })
}
/**
 * @function
 * @description 检查是否有更新
 */
export const checkUpdate = () => {
  console.log('检查更新，有更新会提示更新')
  if (!app.getUpdateManager) {
    return
  }
  const updateManager = app.getUpdateManager()
  updateManager.onUpdateReady(function () {
    app.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      },
    })
  })
}
/**
 * @description 检查用户授权状态，未授权弹出授权，(userInfo除外)，将拿到的权限放在authSetting 中
 * @function
 * @param {string} argSet 要检查的权限,userInfo时：已授权会返回userInfo数据
 * @returns {promise}
 */
export const checkSetting = (argSet) => {
  app.removeStorage({ key: 'authSetting' })
  return new Promise(function (resolve, reject) {
    app.getSetting({
      success(res) {
        app.setStorageSync('authSetting', res.authSetting)
        if (!res.authSetting['scope.' + argSet]) {
          if (argSet === 'userInfo') {
            return reject(new Error('未授权用户信息'))
          }
          app.authorize({
            scope: 'scope.' + argSet,
            success(rs) {
              return resolve(rs)
            },
            fail(err) {
              return reject(err)
            },
          })
        } else {
          if (argSet === 'userInfo') {
            app.getUserInfo({
              success: (res) => {
                return resolve(res)
              },
              fail: (err) => {
                return reject(err)
              },
            })
          } else {
            return resolve(res)
          }
        }
      },
      fail(err) {
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
export const getLocation = (argType = 'gcj02', argAltitude = false) => {
  const location = () => {
    return new Promise(function (resolve, reject) {
      app.getLocation({
        altitude: argAltitude,
        type: argType,
        success: (res) => {
          console.log(res)
          return resolve(res)
        },
        fail: (err) => {
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
    } catch (err) {
      if (err.errMsg) {
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
 * @returns {promise}
 */
export const scrollTop = (scrollTop = 0, duration = 0) => {
  app.pageScrollTo({
    scrollTop: scrollTop,
    duration: duration,
  })
}

/**
 * @description toast默认为文字提示,默认推迟320ms显示
 * @function
 * @param {string} argTitle title
 * @param {object} argOption toast 的option
 * @returns {promise}
 */
export const toast = (
  argTitle,
  argOption = { icon: 'none', delay: 320, duration: 3000 }
) => {
  return new Promise(async function (resolve, reject) {
    Object.assign(argOption, {
      title: argTitle,
      success: async () => {
        await sleep(argOption.duration || 5000)
        return resolve()
      },
      fail: (err) => {
        return reject(err)
      },
    })
    if (argOption.delay) {
      await sleep(argOption.delay)
      return app.showToast(argOption)
    } else {
      return app.showToast(argOption)
    }
  })
}

/**
 * @function
 * @description 设置标题
 * @param  {} argTitle 标题
 */
export const setTitle = (argTitle) => {
  app.setNavigationBarTitle({
    title: argTitle,
  })
}

/**
 * @function
 * @description mpvue跳到特定页面
 * @param  {string} argPage 标题
 * @param  {object} argParams url参数
 * @param  {string} argType 跳转类型 switchTab reload redirectTo reLaunch navigateTo
 */
export const toPage = (argPage, argParams = {}, argType, argForce = 0) => {
  const toPageFn = () => {
    console.log('params:', argPage, setUrlParams(argParams), argType, argForce)
    // 返回处理
    if (!argPage || argPage === 'back') {
      // -1时返回首页
      if (+argType === -1) {
        app.reLaunch({
          url: '/pages/index/index' + setUrlParams(argParams),
        })
        return
      }
      // #ifdef  H5
      window.history.go(+('-' + (argType || 1)))
      // #endif
      // #ifndef  H5
      if (getCurrentPages().length > 1 && argType !== '-1') {
        app.navigateBack({
          delta: +argType || 1,
        })
      } else {
        app.reLaunch({
          url: '/pages/index/index' + setUrlParams(argParams),
        })
      }
      // #endif
      return
    }
    // 每次进入首页都重载
    if (argPage === 'index') {
      app.reLaunch({
        url: '/pages/' + argPage + '/index' + setUrlParams(argParams),
      })
      return
    }
    let type = ''
    // #ifdef  H5
    type = 'h5'
    // #endif
    let temUrl = '/pages/' + argPage + '/index' + setUrlParams(argParams)
    // 匹配绝对路径和url
    if (argPage[0] === '/' || /http:\/\/|https:\/\//.test(argPage)) {
      temUrl = argPage + setUrlParams(argParams)
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
        if (type === 'h5') {
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
        if (getCurrentPages() && getCurrentPages().length === 10) {
          app.redirectTo({
            url: '/pages/' + argPage + '/index' + setUrlParams(argParams),
          })
        } else {
          app.navigateTo({
            url: '/pages/' + argPage + '/index' + setUrlParams(argParams),
          })
        }
        break
    }
  }
  // #ifdef  H5
  argForce = true
  // #endif
  if (argForce) {
    toPageFn()
  } else {
    throttle.throttle(toPageFn)
  }
}

/**
 * @function
 * @description 当前页面数据obj
 */
export const getCurrentPage = () => {
  var pages = getCurrentPages() || []
  return pages[pages.length - 1] || {}
}

/**
 * @function
 * @description 获取当前页url
 * @param {boolean} argWithParams 是否附带参数
 */
export const getCurrentPageUrl = (argWithParams) => {
  var currentPage = getCurrentPage()
  var url = currentPage.route
  var options = currentPage.options
  if (argWithParams) {
    url += this.urlParams(options)
  }
  return url
}

/**
 * @function
 * @description 获取微信登录code
 * @returns {promise}
 */
export const login = () => {
  return new Promise(function (resolve, reject) {
    app.login({
      timeout: 5000,
      success: function (rs) {
        app.setStorageSync('code', rs.code)
        console.info('login info:', rs)
        return resolve(rs)
      },
      fail: function (err) {
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
export async function getUserInfo(argData) {
  L.loading(1)
  const _login = await login().catch((err) => {
    console.log(err)
    L.loading()
  })
  const setUserInfo = (argData) => {
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
      console.log('未授权', err)
      L.loading()
    })
    _checkSetting.code = _login.code
    return setUserInfo(_checkSetting)
  }
}

/**
 * @function
 * @description 选择图片
 * @param {object} argOptions 选择图片的配置
 * @returns {promise}
 */
export const chooseImage = (argOptions) => {
  return new Promise(function (resolve, reject) {
    const options = {
      success: (rs) => {
        return resolve(rs)
      },
      fail: (err) => {
        toast('请检查网络')
        return reject(err)
      },
    }
    app.chooseImage(Object.assign(options, argOptions))
  })
}

/**
 * @function
 * @description 下载图片到手机
 * @param {object} argImgList 图片url,数组或字符串
 * @param {object} argIsLocal 是否是本地临时文件路径或永久文件路径
 * @returns {promise} 出错时无promise
 */
export const downloadImgs = async (argImgList = [], argIsLocal = false) => {
  let isAuth = true
  let res = null
  if (argImgList && typeof argImgList === 'string') {
    argImgList = [argImgList]
  }
  if (!argImgList.length) {
    console.log('参数有误！')
    return
  }
  L.loading(1)
  await checkSetting('writePhotosAlbum').catch((err) => {
    console.error(err)
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
  for (const img of argImgList) {
    let tempFilePath = img
    if (!argIsLocal) {
      res = await P('downloadFile', { url: img })
      tempFilePath = res.tempFilePath
    }
    let saveFail = false
    await P('saveImageToPhotosAlbum', {
      filePath: tempFilePath,
    }).catch((err) => {
      saveFail = true
      console.error(err)
    })
    if (saveFail) {
      L.loading()
      toast('保存到相册失败，请重试！')
      return
    }
  }
  L.loading()
  await toast('下载完成！')
}
/**
 * @function
 * @description 上传图片，返回临时图片路径
 * @param {object} argOptions 选择图片chooseImage配置
 * @param {object} argQuality 压缩质量默认80
 * @param {object} argMb 超过多少M压缩，默认1M(仅支持jpg)
 * @returns {promise} 返回临时图片路径[{tempFilePath:'临时路径',size: '不压缩时返回'}]
 */
export const uploadImgs = async (
  argOptions = {},
  argQuality = 80,
  argMb = 1
) => {
  let err = ''
  const res = await P('chooseImage', {
    count: argOptions.count || 9,
    sizeType: argOptions.sizeType || ['original', 'compressed'],
    sourceType: argOptions.sourceType || ['album', 'camera'],
  }).catch((error) => {
    err = error
  })
  if (!res) {
    console.error(err)
    return new Promise((resolve, reject) => {
      reject(err)
    })
  }
  console.error('选择文件：', res)
  showLoading()
  // 按需压缩
  const tempFiles = res.tempFiles
  const compressImage = async (argData) => {
    console.error('压缩数据：', argData)
    if (argData.size > argMb * 1024 * 1024) {
      console.log('未压缩前：', argData)
      // #ifdef MP-WEIXIN
      if (argData.path.match('jpg')) {
        return P('compressImage', {
          src: argData.path,
          quality: argQuality,
        })
      }
      // #endif
      let sizeMb = argData.size / 1024 / 1024
      const getBase64Image = async (argData) => {
        console.log('canvas压缩')
        var canvas = document.createElement('canvas')
        var img = argData.img
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        let rate = 0.95
        if (sizeMb > 10) {
          rate = 0.05
        } else if (sizeMb < 1.5) {
          rate = 1
        } else if (sizeMb < 4) {
          rate = (10 - sizeMb) / 10
        } else if (sizeMb < 9) {
          rate = (9 - sizeMb) / 10
        } else {
          rate = (10 - sizeMb) / 10
        }
        var dataURL = canvas.toDataURL('image/jpeg', rate)
        var blob = await dataURLtoBlob(dataURL)
        var file = await blobToFile(blob, argData.name)
        console.error(
          'old:',
          argData.size / 1024,
          'new:',
          dataURL.length / 1024,
          'fileSize:',
          file.size / 1024,
          file,
          typeof file
        )
        return file
      }
      const loadImg = async (argData) => {
        return new Promise((resolve, reject) => {
          var img = new Image()
          img.src = argData.path
          console.error(img)
          img.onload = function () {
            return resolve({ img, name: argData.name || '' })
          }
        })
      }
      let file = argData
      if (sizeMb > 1) {
        file = await getBase64Image(await loadImg(argData))
      }
      return Promise.resolve({
        tempFilePath: argData.path,
        file: file,
        fileName: argData.name || '',
        size: argData.size,
      })
    }
    return Promise.resolve({
      tempFilePath: argData.path,
      size: argData.size,
      file: argData,
    })
  }
  const tempFilePathsFn = tempFiles.map(compressImage)
  let tempFilePaths = []
  tempFilePaths = await Promise.all(tempFilePathsFn).catch((error) => {
    // console.error(error)
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
export const getSystemInfo = () => {
  let info = {}
  if (typeof app === 'object' && safeData(app, 'getSystemInfoSync')) {
    info = app.getSystemInfoSync()
    info.platform = info.platform.toLowerCase()
    info.isIos = info.platform === 'ios'
    info.isAndroid = info.platform === 'android'
    info.iosVersion = info.isIos && info.system.match(/\d./)[0]
    return info
  }
  const ua = navigator.userAgent.toLowerCase()
  const platform = navigator.platform.toLowerCase()
  info = {
    ua: ua,
    platform: platform,
    isMobile: ua.match(/mobile/) && true,
    isWin: platform.match('win') && true,
    isIphone: ua.match(/iphone/) && true,
    isIpad: ua.match(/ipad/) && true,
    isMac: platform.match('mac') && true,
    isIos: platform.match('ios') && true,
    isAndroid: platform.match('android') && true,
    isSafari: ua.indexOf('safari') > -1 && ua.indexOf('chrome') < 1,
    isIE: !!window.ActiveXObject || 'ActiveXObject' in window,
  }
  if (info.ua.match('msie')) {
    const IE = info.ua.match(/msie\s([0-9]*)/)
    if (IE.length >= 2) {
      info.isIe = IE[1]
    }
  }
  info.isAppleMobile =
    info.isMobile &&
    ua.toLowerCase().indexOf('applewebkit') &&
    ua.indexOf('chrome') < 1
  info = Object.assign(navigator, info)
  return info
}

/**
 * @function
 * @description 小程序云函数记录日志（需要添加云函数log，弃用）
 * @param {object} argData log内容
 */
export const log = async (...argData) => {
  try {
    const systemInfo = getSystemInfo()
    console.log(systemInfo)
    if (frame === 'wx') {
      // 只有不在开发工具上触发的才上报
      if (systemInfo.platform !== 'devtools') {
        const systemInfo = getSystemInfo()
        const res = await app.getNetworkType()
        await wx.cloud
          .callFunction({
            name: 'log',
            data: {
              clientType: systemInfo.model,
              systemInfo: JSON.stringify(systemInfo),
              pageRoute: getCurrentPage().route,
              message: [...argData],
              networkType: res.networkType,
              errorTime: new Date(),
            },
          })
          .catch((err) => console.error(err))
      }
    } else {
      console.error(...argData)
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * @function
 * @description 获取storage的值，默认将json转为obj
 * @param {string} argKey 要获取的key
 * @param {string} argNoJson true时不自动转换JSON字符串
 * @returns {promise} key对应的数据
 */
export const getStorage = async (argKey, argNoJson) => {
  let res = await P('getStorage', { key: argKey })
  if (appConfig.localEncrypt) {
    res = decode(res.data)
  }
  if (!res || !res.data) {
    log(['获取失败', res])
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
 * @param {string} argNoJson true时不自动转换JSON字符串
 * @returns {data} key对应的数据
 */
export const getStorageSync = (argKey, argNoJson) => {
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
 * @returns {data} key对应的数据
 */
export const clearStorageSync = async (argKey = '', argExtraKey = {}) => {
  if (argKey) {
    app.removeStorageSync(argKey)
  } else {
    let res = await P('getStorageInfo')
    res.keys.map((v) => {
      if (!argData.force) {
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
 * @description 获取storage的值
 * @param {string} argKey 要获取的key
 * @returns {promise} key对应的数据
 */
export const getStorageSyncForVuex = (argKey) => {
  let data = app.getStorageSync(argKey)
  if (appConfig.localEncrypt) {
    data = decode(data)
  }
  return data
}

/**
 * @function
 * @description 设置storage的值，默认将obj转为json
 * @param {string} argKey 要设置的key
 * @param {string} argData 要设置的值
 * @returns {promise} key对应的数据
 */
export const setStorage = async (argKey, argData) => {
  let temData = argData
  if (appConfig.localEncrypt) {
    temData = encode(argData)
  }
  const res = await P('setStorage', { key: argKey, data: temData })
  if (!res || !res.errMsg.match('ok')) {
    log(['setStorage失败', res])
  }
  return res.data || res || ''
}

/**
 * @function
 * @description wx api转Promise
 * @param {object} argApi 需要转promise的API名称
 * @param {object} argOptions api对应的配置，除了success和fail
 * @returns {promise}
 */
export const P = (argApi, argOptions) => {
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
      return Promise.reject('无此方法')
    }
  })
}

/**
 * 描述
 * @function
 * @description 微信实时日志记录
 * @date 2019-09-26
 * @returns {functions}
 */
export const ljLog = () => {
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
    return
  }
  const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
  if (!log) {
    console.log('实时日志未生效')
    return null
  }
  return {
    debug() {
      // console.log(arguments)
      if (!log) return
      log.debug.apply(log, arguments)
    },
    info() {
      // console.log(arguments)
      if (!log) return
      log.info.apply(log, arguments)
    },
    warn() {
      // console.log(arguments)
      if (!log) return
      log.warn.apply(log, arguments)
    },
    error() {
      // console.log(arguments)
      if (!log) return
      log.error.apply(log, arguments)
    },
    setFilterMsg(msg) {
      // 从基础库2.7.3开始支持
      if (!log || !log.setFilterMsg) return
      if (typeof msg !== 'string') return
      log.setFilterMsg(msg)
    },
    addFilterMsg(msg) {
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
 * @date 2019-09-26
 * @returns {functions}
 */
export const cloudApi = async (argOption = {}) => {
  if (wx) {
    L.loading(1)
    let error = ''
    const res = await wx.cloud.callFunction(argOption).catch((err) => {
      toast(`云函数:${argOption.name}调用失败！`)
      error = err
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
 * 描述
 * @function
 * @description 设置CountNum 全局倒计时
 * @param argData 倒计秒数
 * @date 2019-09-26
 * @returns {functions}
 */
const setCountNum = (argData) => {
  store.commit('SetCountNum', argData)
}
/**
 * 描述
 * @function
 * @description 获取全局倒计时对象
 * @date 2019-09-26
 * @returns {functions}
 */
export const GlobalCounter = new Counter(
  +getStorageSync('CountNum') || 60,
  setCountNum
)
export const APP = app
