/**
 * @description flyio配置，按需复制一份处理
 */
import fly from 'flyio'
import Loading from './class/Loading'
import { Toast } from 'vant'
let noToast = false
let toast = (...argData) => {
  if (noToast) {
    return
  }
  setTimeout(() => {
    Toast(...argData)
  }, 320)
}
const suCode = ',0,'
fly.config.timeout = process.env.VUE_APP_TIMEOUT || 10000
fly.config.baseURL = process.env.BASE_URL.replace('/rs', '')

const showLoading = () => {
  Toast.loading({
    // 持续展示 toast
    duration: 0,
    // 禁用背景点击
    forbidClick: true,
    // 背景
    // mask: true,
    // loadingType: 'spinner'
  })
}
const hideLoading = () => {
  Toast.clear('clearAll')
}
let L = new Loading(showLoading, hideLoading)
// 添加请求拦截器
fly.interceptors.request.use((request) => {
  L.loading(1)
  // 给所有请求添加自定义header
  // request.headers['X-Tag'] = 'flyio'
  // 打印出请求体
  console.debug('请求拦截', request)
  if (request.config.noToast) {
    noToast = request.config.noToast
  } else {
    noToast = false
  }
  // 终止请求
  // var err=new Error("xxx")
  // err.request=request
  // return Promise.reject(new Error(""))
  return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  async (res) => {
    L.loading()
    console.debug('响应拦截:', res)
    // const data = JSON.parse(res.data)
    const data = res.data
    if (suCode.match(',' + data.code + ',')) {
      return data.data
    }
    // 其它异常
    switch (data.code) {
      case 1:
        toast(data.msg)
        return Promise.reject(data.msg)
      case 4:
        console.log('请授权登录', data.data.url)
        window.location.href = data.data.url
        return Promise.reject(data.data)
      default:
        return Promise.reject(data.data)
    }
  },
  async (err) => {
    L.loading()
    // 发生网络错误后会走到这里
    console.error('http err:', err)
    // 超时处理
    if (err && err.message && err.message.match('timeout')) {
      console.error(err.message)
      toast('请求超时！')
      return Promise.reject(err)
    }
    // 状态码判断
    switch (err.status) {
      case 404:
        toast('请求失败,请重试')
        break
      case 500:
        toast('服务器错误,请重试')
        break
    }
    // 发生网络错误后reject
    return Promise.reject(err)
  }
)
export const post = (argData) => {
  if (!argData) {
    return
  }
  return fly.request(argData.url, argData.params, {
    method: 'post',
    config: argData.config,
  })
}
export const get = (argData) => {
  if (!argData) {
    return
  }
  return fly.request(argData.url, argData.params, {
    method: 'get',
    config: argData.config,
  })
}
export const request = (argData) => {
  if (!argData) {
    return
  }
  return fly.request(argData.url, argData.params, {
    method: argData.method,
    config: argData.config,
  })
}
export default fly
