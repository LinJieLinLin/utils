/*
 * @Author: linj
 * @Email: 993353454@qq.com
 * @Date: 2020-05-13 10:08:05
 * @Description: 默认mixins
 */
import { mapState, mapMutations } from 'vuex'
const init = argOptions => {
  console.log('mixin init', argOptions)
}
const mixin = {
  data() {
    return {
      // 进入页面的参数
      Params: {}
    }
  },
  onLoad(argData) {
    this.Params = argData || {}
  },
  onShow() {},
  components: {},
  computed: {
    ...mapState(['UserInfo', 'Reload'])
  },
  methods: {
    ...mapMutations(['SetReload']),
    // 检测是否需要重load
    CheckReload() {
      if (this.Reload) {
        console.log('find reload,call ini()')
        this.init()
        this.SetReload()
      }
    },
    Back() {
      this.$f.toPage('back', '', this.$f.safeData(this.Params, 'back', ''))
    }
  },
  // 分享相关
  onShareAppMessage(argData) {
    // https://uniapp.dcloud.io/api/plugins/share?id=onshareappmessage
    return {
      title: '欢迎体验uni-app',
      // 页面 path ，必须是以 / 开头的完整路径。 QQ小程序不支持
      path: '/pages/index/index',
      imageUrl: '',
      // 百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案;百度小程序、支付宝小程序
      content: '',
      // 自定义分享描述支付宝小程序、字节跳动小程序
      desc: '',
      // 自定义分享二维码的背景图，建议大小750*950（网络图片路径）支付宝小程序
      bgImgUrl: '',
      // QQ小程序查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 qq.getLaunchOptionSync() 或 qq.onShow() 获取启动参数中的 query。QQ小程序
      query: '',
      // 开发者后台设置的分享素材模板 id字节跳动小程序
      templateId: '',
      // 接口调用成功的回调函数支付宝小程序、百度小程序
      success: () => {},
      // 接口调用成功的回调函数支付宝小程序、百度小程序
      fail: () => {},
      // 接口调用成功的回调函数支付宝小程序、百度小程序
      complete: () => {}
    }
  }
}
export default {
  init,
  mixin
}
