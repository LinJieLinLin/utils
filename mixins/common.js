import { mapState, mapMutations } from 'vuex'
const init = (argOptions) => {
  console.log('mixin init', argOptions)
}
const mixin = {
  data() {
    return {
      // 进入页面的参数
      Params: {},
      // 页面loading状态
      LoadSu: true,
    }
  },
  onLoad(argData) {
    this.Params = argData || {}
    if (this.init) {
      this.init()
    }
  },
  onShow() {},
  components: {},
  computed: {
    ...mapState(['UserInfo', 'Reload']),
  },
  methods: {
    ...mapMutations(['SetReload']),
    // 检测是否需要重load
    CheckReload() {
      if (this.Reload) {
        console.log('reload init()')
        this.init()
        this.SetReload()
      }
    },
    /**
     * @description:
     * @param {type} argKey '要赋值的数据下标，相对于this',
     * @param {type} argValue 数据,
     * @return:
     */
    SetKv(argKey, argValue) {
      let temData = this.$f.safeData(this, argKey)
      if (temData || typeof temData !== 'undefined') {
        // 小程序赋值
        if (Array.isArray(argValue)) {
          this.$f.safeData(this, argKey, [], true)
        }
        this.$f.safeData(this, argKey, argValue, true)
      } else {
        console.error(
          this.$f.safeData(this, argKey) + '数据' + argKey + '不存在！'
        )
      }
    },
    /**
     * @description: mixin监听数据变动，调用指定函数（主要用于小程序）
     * @param {object} argData{ // key与fn只传其一
     * key: '要赋值的数据下标，相对于this',
     * fn: '要调用的函数名',
     * data: '数据'
     * }
     * @return: no
     */
    ComChange(argData) {
      // console.log(argData)
      if (argData.key) {
        this.SetKv(argData.key, argData.data)
      }
      if (typeof this[argData.fn] === 'function') {
        let [, ...args] = [...arguments]
        this[argData.fn](argData.data, ...args)
      } else if (argData.fn) {
        console.error('函数' + argData.fn + '不存在！')
      }
    },
    // 后退
    Back() {
      this.$f.toPage('back', '', this.$f.safeData(this.Params, 'back', ''))
    },
    /**
     * @description: 获取dom节点相关信息
     * @param {String} argId id/class
     * @param {String} getAll 是否获取全部 true时，返回数组
     * @param {String} argOptions 修改默认返回具体参考：https://uniapp.dcloud.io/api/ui/nodes-info?id=nodesreffields
     * @return: object/array
     */
    async GetDom(argId, getAll, argOptions) {
      let temOptions = {
        id: true,
        dataset: true,
        rect: true,
        size: true,
        scrollOffset: true,
        computedStyle: [],
        context: true,
      }
      // #ifdef APP-PLUS||MP-WEIXIN
      temOptions.properties = []
      // #endif
      if (argOptions) {
        Object.assign(temOptions, argOptions)
      }
      return new Promise((resolve) => {
        let nodesRef
        let temDom = uni.createSelectorQuery().in(this)
        nodesRef = temDom[getAll ? 'selectAll' : 'select'](argId)
        nodesRef
          .fields(temOptions, (res) => {
            if (getAll && Array.isArray(res) && res.length) {
              resolve(res)
            }
            if (!getAll && res) {
              resolve(res)
            }
          })
          .exec()
      })
    },
  },
  // 分享相关
  onShareAppMessage(argData) {
    console.error('调用了分享', argData)
    // https://uniapp.dcloud.io/api/plugins/share?id=onshareappmessage
    return {
      title: this.$store.state.ShareTitle || '欢迎分享',
      // 页面 path ，必须是以 / 开头的完整路径。 QQ小程序不支持
      path: '/pages/index/index',
      imageUrl: '',
      // 百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案;百度小程序、支付宝小程序
      // content: '',
      // // 自定义分享描述支付宝小程序、字节跳动小程序
      // desc: '',
      // // 自定义分享二维码的背景图，建议大小750*950（网络图片路径）支付宝小程序
      // bgImgUrl: '',
      // // QQ小程序查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 qq.getLaunchOptionSync() 或 qq.onShow() 获取启动参数中的 query。QQ小程序
      // query: '',
      // // 开发者后台设置的分享素材模板 id字节跳动小程序
      // templateId: '',
      // // 接口调用成功的回调函数支付宝小程序、百度小程序
      // success: () => {},
      // // 接口调用成功的回调函数支付宝小程序、百度小程序
      // fail: () => {},
      // // 接口调用成功的回调函数支付宝小程序、百度小程序
      // complete: () => {},
    }
  },
  onShareTimeline() {
    console.error('调用了朋友圈分享')
    return {
      title: this.$store.state.ShareTitle || '欢迎分享',
      query: 'type=timeline',
      // 自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1。
      // imageUrl:'',
    }
  },
}
export default {
  init,
  mixin,
}
