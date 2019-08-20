/* eslint-disable no-constant-condition,no-undef */
import { Loading, Throttle } from './jClass'
import { sleep } from './j'

let app = {}
if (typeof uni !== 'undefined') {
  app = uni
} else if (typeof taro !== 'undefined') {
  app = taro
} else if (typeof wx !== 'undefined') {
  app = wx
}

// 初始化loading
let L = new Loading(() => {
  app.showLoading({})
}, app.hideLoading)

let throttle = new Throttle()

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
  }
}
/**
 * @description 修改设置拦截函数
 * @function
 * @param {function} argRequest 请求拦截
 * @param {argResponse} argRequest 响应拦截
 */
export const setRequest = (argRequest, argResponse) => {
  if (typeof argRequest === 'function') {
    interceptors.request = argData => {
      L.loading(1)
      return argRequest(argData)
    }
  }
  if (typeof argResponse === 'function') {
    interceptors.response = argData => {
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
export const request = argOption => {
  argOption = interceptors.request(argOption)
  return new Promise((resolve, reject) => {
    let config = {
      url: argOption.url,
      method: argOption.method || 'GET',
      data: argOption.params,
      success(res) {
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
      }
    }
    Object.assign(config, argOption.config)
    app.request(config)
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
  updateManager.onUpdateReady(function() {
    app.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
}
/**
 * @description 检查用户授权状态，未授权弹出授权，(userInfo除外)，将拿到的权限放在authSetting 中
 * @function
 * @param {string} argSet 要检查的权限,userInfo时：已授权会返回userInfo数据
 * @returns {promise}
 */
export const checkSetting = argSet => {
  app.removeStorage({ key: 'authSetting' })
  return new Promise(function(resolve, reject) {
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
            }
          })
        } else {
          if (argSet === 'userInfo') {
            app.getUserInfo({
              success: res => {
                return resolve(res)
              },
              fail: err => {
                return reject(err)
              }
            })
          } else {
            return resolve(res)
          }
        }
      },
      fail(err) {
        return reject(err)
      }
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
  let location = () => {
    return new Promise(function(resolve, reject) {
      app.getLocation({
        altitude: argAltitude,
        type: argType,
        success: res => {
          console.log(res)
          return resolve(res)
        },
        fail: err => {
          return reject(err)
        }
      })
    })
  }
  let re = async () => {
    try {
      await checkSetting('userLocation')
      let re = await location()
      return re
    } catch (err) {
      if (err.errMsg) {
        app.show({
          title: '您已拒绝地理位置授权,可以在设置中重新打开',
          icon: 'none'
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
    duration: duration
  })
}

/**
 * @description toast默认为文字提示
 * @function
 * @param {string} argTitle title
 * @param {object} argOption toast 的option
 * @returns {promise}
 */
export const toast = (argTitle, argOption = { icon: 'none' }) => {
  return new Promise(function(resolve, reject) {
    Object.assign(argOption, {
      title: argTitle,
      success: () => {
        sleep(argOption.duration || 1500).then(res => {
          return resolve()
        })
      },
      fail: err => {
        return reject(err)
      }
    })
    return app.showToast(argOption)
  })
}

/**
 * @function
 * @description 设置标题
 * @param  {} argTitle 标题
 */
export const setTitle = argTitle => {
  app.setNavigationBarTitle({
    title: argTitle
  })
}

/**
 * @description obj转url参数
 * @function
 * @param {object} argParams 参数对象
 * @param {boolean} noMark 默认带?,true时,不带
 * @returns {string}
 */
export const setUrlParams = (argParams, noMark) => {
  let re = ''
  if (!noMark) {
    re = '?'
  }
  for (let k in argParams) {
    re += k + '=' + argParams[k] + '&'
  }
  if (argParams) {
    re = re.substring(0, re.length - 1)
  }
  return re
}

/**
 * @function
 * @description mpvue跳到特定页面
 * @param  {string} argPage 标题
 * @param  {object} argParams url参数
 * @param  {string} argType 跳转类型 switchTab reload redirectTo reLaunch navigateTo
 */
export const toPage = (argPage, argParams = {}, argType) => {
  let toPageFn = () => {
    console.log('page:', argPage, setUrlParams(argParams))
    if (!argPage || argPage === 'back') {
      app.navigateBack({
        delta: argType || 1
      })
      return
    }
    if (argPage === 'index') {
      app.reLaunch({
        url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
      })
      return
    }
    switch (argType) {
      case 'switchTab':
        app.switchTab({
          url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
        })
        break
      case 'reload':
        app.reLaunch({
          url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
        })
        break
      case 'redirectTo':
        app.redirectTo({
          url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
        })
        break
      case 'reLaunch':
        app.reLaunch({
          url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
        })
        break
      default:
        app.navigateTo({
          url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
        })
        break
    }
  }
  throttle.throttle(toPageFn)
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
export const getCurrentPageUrl = argWithParams => {
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
  return new Promise(function(resolve, reject) {
    app.login({
      timeout: 5000,
      success: function(rs) {
        app.setStorageSync('code', rs.code)
        console.info('login info:', rs)
        return resolve(rs)
      },
      fail: function(err) {
        toast('请检查网络')
        return reject(err)
      }
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
  const _login = await login().catch(err => {
    console.log(err)
    L.loading()
  })
  const setUserInfo = argData => {
    L.loading()
    return argData
  }
  if (argData) {
    if (argData.target) {
      argData.target.code = _login.code
    }
    return setUserInfo(argData.target)
  } else {
    const _checkSetting = await checkSetting('userInfo').catch(err => {
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
export const chooseImage = argOptions => {
  return new Promise(function(resolve, reject) {
    let options = {
      success: rs => {
        return resolve(rs)
      },
      fail: err => {
        toast('请检查网络')
        return reject(err)
      }
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
  await checkSetting('writePhotosAlbum').catch(err => {
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
        let res = await P('openSetting')
        if (res.authSetting['scope.writePhotosAlbum']) {
          app.showModal({
            title: '提示',
            content: '已获得权限，请重新操作！',
            showCancel: false
          })
          return true
        } else {
          app.showModal({
            title: '提示',
            content: '未获得权限，将无法保存到相册哦~',
            showCancel: false
          })
          return false
        }
      }
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
      filePath: tempFilePath
    }).catch(err => {
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
export const uploadImgs = async (argOptions, argQuality = 80, argMb = 1) => {
  let err = ''
  let res = await P('chooseImage', {
    count: argOptions.count || 9,
    sizeType: argOptions.sizeType || ['original', 'compressed'],
    sourceType: argOptions.sourceType || ['album', 'camera']
  }).catch(error => {
    // console.error(error)
    err = error
  })
  if (!res) {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  }
  // 按需压缩
  const tempFiles = res.tempFiles
  let compressImage = async argData => {
    if (argData.path.match('jpg') && argData.size > argMb * 1024 * 1024) {
      console.log('未压缩前：', argData)
      return P('compressImage', {
        src: argData.path,
        quality: argQuality
      })
    } else {
      return new Promise(resolve => {
        resolve({ tempFilePath: argData.path, size: argData.size })
      })
    }
  }
  let tempFilePathsFn = tempFiles.map(compressImage)
  let tempFilePaths = []
  tempFilePaths = await Promise.all(tempFilePathsFn).catch(error => {
    // console.error(error)
    err = error
  })
  if (!tempFilePaths) {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  }
  return new Promise(resolve => {
    return resolve(tempFilePaths)
  })
}

/**
 * @function
 * @description wx api转Promise
 * @param {object} argApi 需要转promise的API名称
 * @param {object} argOptions api对应的配置，除了success和fail
 * @returns {promise}
 */
export const P = (argApi, argOptions) => {
  return new Promise(function(resolve, reject) {
    if (!argApi && argOptions.success) {
      return argOptions.success(resolve, reject)
    }
    let options = {
      success: resolve,
      fail: reject
    }
    Object.assign(options, argOptions)
    wx[argApi](options)
  })
}
