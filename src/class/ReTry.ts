// 定义一个自定义的定时器类
class MySetInterVal {
  a: number
  b: number
  time: number
  handle: any
  fn: Function

  // 构造函数
  constructor(fn: Function, a: number, b: number) {
    // 初始化参数a
    this.a = a
    // 初始化参数b
    this.b = b
    // 初始化时间
    this.time = 0
    // 初始化句柄
    this.handle = -1
    // 执行传入的函数
    this.fn = fn
  }

  // 定义开始函数
  start() {
    // 设置定时器
    this.handle = setTimeout(() => {
      // 执行传入的函数
      this.fn()
      // 时间递增
      this.time++
      // 递归调用开始函数
      this.start()
      // 打印计算结果
      console.log(this.a + this.time * this.b)
    }, this.a + this.time * this.b)
  }

  // 定义停止函数
  stop() {
    // 清除定时器
    clearTimeout(this.handle)
    // 重置时间
    this.time = 0
  }
}

// 创建一个新的定时器实例
let a = new MySetInterVal(
  () => {
    console.log('123')
  },
  1000,
  2000
)
// 开始定时器
a.start()
// 停止定时器
a.stop()
