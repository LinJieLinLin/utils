import { Loading } from './jClass'
let L = new Loading(() => {
  wx.showLoading({})
}, wx.hideLoading)
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
  argOption.params = interceptors.request(argOption.params)
  return new Promise((resolve, reject) => {
    let config = {
      url: argOption.url,
      method: argOption.method || 'GET',
      data: argOption.params,
      success(res) {
        interceptors.response(res)
        return resolve(res)
      },
      fail(err) {
        interceptors.response(err)
        return reject(err)
      }
    }
    Object.assign(config, argOption.config)
    wx.request(config)
  })
}
/**
 * @function
 * @description 检查是否有更新
 */
export const checkUpdate = () => {
  console.log('检查更新，有更新会提示更新')
  if (!wx.getUpdateManager) {
    return
  }
  const updateManager = wx.getUpdateManager()
  updateManager.onUpdateReady(function() {
    wx.showModal({
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
 * @description 检查用户授权状态，UserInfo除外，将拿到的权限放在authSetting 中
 * @function
 * @param {string} argSet 要检查的权限
 * @returns {promise}
 */
export const checkSetting = argSet => {
  wx.removeStorage({ key: 'authSetting' })
  return new Promise(function(resolve, reject) {
    wx.getSetting({
      success(res) {
        wx.setStorageSync('authSetting', res.authSetting)
        if (!res.authSetting['scope.' + argSet]) {
          if (argSet === 'userInfo') {
            return reject(new Error('未授权用户信息'))
          }
          wx.authorize({
            scope: 'scope.' + argSet,
            success(rs) {
              return resolve(rs)
            },
            fail(err) {
              return reject(err)
            }
          })
        } else {
          return resolve(res)
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
export const getLocation = (argType = 'wgs84', argAltitude = false) => {
  let location = () => {
    return new Promise(function(resolve, reject) {
      wx.getLocation({
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
        wx.showToast({
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
  wx.pageScrollTo({
    scrollTop: scrollTop,
    duration: duration
  })
}

/**
 * @description toast默认为文字提示
 * @function
 * @param {string} argTitle title
 * @param {object} argOption toast 的option
 */
export const toast = (argTitle, argOption = { icon: 'none' }) => {
  Object.assign(argOption, {
    title: argTitle
  })
  wx.showToast(argOption)
}

/**
 * @function
 * @description 设置标题
 * @param  {} argTitle 标题
 */
export const setTitle = argTitle => {
  wx.setNavigationBarTitle({
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
  console.log('page:', argPage, setUrlParams(argParams))
  if (!argPage || argPage === 'back') {
    wx.navigateBack({
      delta: argType || 1
    })
    return
  }
  if (argPage === 'index') {
    wx.reLaunch({
      url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
    })
    return
  }
  switch (argType) {
    case 'switchTab':
      wx.switchTab({
        url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
      })
      break
    case 'reload':
      wx.reLaunch({
        url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
      })
      break
    case 'redirectTo':
      wx.redirectTo({
        url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
      })
      break
    case 'reLaunch':
      wx.reLaunch({
        url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
      })
      break
    default:
      wx.navigateTo({
        url: '/pages/' + argPage + '/main' + setUrlParams(argParams)
      })
      break
  }
}

/**
 * @function
 * @description 当前页面数据obj
 */
export const getCurrentPages = () => {
  var pages = getCurrentPages()
  return pages[pages.length - 1]
}

/**
 * @function
 * @description 获取当前页url
 * @param {boolean} argWithParams 是否附带参数
 */
export const getCurrentPageUrl = argWithParams => {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var url = currentPage.route
  var options = currentPage.options
  if (argWithParams) {
    url += this.urlParams(options)
  }
  return url
}

/**
 * @function
 * @description 判断微信授权登录状态，设置code
 * @returns {promise}
 */
export const needLogin = () => {
  return new Promise(function(resolve, reject) {
    let login = () => {
      return wx.login({
        timeout: 5000,
        success: function(rs) {
          console.info('login code:', rs.code)
          wx.setStorageSync('code', rs.code)
          return resolve(rs)
        },
        fail: function(err) {
          toast('请检查网络')
          return resolve(err)
        }
      })
    }
    wx.checkSession({
      timeout: 5000,
      success: rs => {
        // session_key 未过期，并且在本生命周期一直有效
        return reject(rs)
      },
      fail: err => {
        console.log(err)
        return login()
      }
    })
  })
}

/**
 * @function
 * @description 获取微信登录code
 * @returns {promise}
 */
export const login = () => {
  return new Promise(function(resolve, reject) {
    wx.login({
      timeout: 5000,
      success: function(rs) {
        wx.setStorageSync('code', rs.code)
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
