/*
import { getRegexp } from './../j';
import { safeData } from 'lj-utils/j';
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-01-21 11:54:25
 * @description: no
 */
import chai from 'chai'
import j from '../../index'
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai
const { Blob } = require('buffer')
describe('j.js', function () {
  before(function () {
    // mock
    global.Blob = Blob
    // mock
    global.File = function (a, b, c) {
      return new Blob([a])
    }
    global.XMLHttpRequest = function () {
      this.status = 200
      this.response = '1'
      this.open = function (type, data, isFalse) {
        this.data = data
      }
      this.send = function () {
        if (j.isBlob(this.data)) {
          return this.onload({target:{result:1}})
        } else {
          return this.error(new Error('非blob'))
        }
      }
    }
    global.FileReader = function () {
      return {
        onload() {},
        onerror() {
          return 1
        },
        readAsDataURL: function (argData) {
          if (j.isBlob(argData)) {
            return this.onload({ target: { result: 'base64' } })
          } else {
            return this.onerror()
          }
        },
      }
    }
    global.globalThis = {
      location: {},
      atob: (data) => data,
      navigator: {
        userAgent: 'sbb msie mobile',
        userAgentData: {
          platform: 'msie',
        },
      },
      addEventListener(argName, argCb) {
        return argCb()
      },
      localStorage:{
        getItem(argData){
          return argData
        },
        setItem(){
          
        }
      },
      document: {
        cookie: 'uid=1; 1=1; a=2; b=B; c=c',
        getElementById:()=>{},
        getElementsByTagName: () => [{ innerText: '',appendChild(){} }],
        createElement(a) {
          return {
            download: 1,
            href: '',
            click() {
              return true
            },
          }
        },
        body: {
          appendChild: (a) => a,
          removeChild: (a) => a,
        },

        documentElement: {
          clientWidth: 375,
          style: {},
        },
      },
    }
  })

  after(function () {
    // runs after all tests in this block
  })

  beforeEach(function () {
    // runs before each test in this block
    // globalThis = {
    //   location: {},
    //   document:{
    //     getElementsByTagName:'',
    //   }
    // }
  })

  afterEach(function () {
    // runs after each test in this block
  })
  describe('j.js', function () {
    it('getRegexp', function () {
      const regexp = j.getRegexp()
      expect(regexp).to.be.a('object')
    })
    it('safeData', function () {
      const obj = { b: '', c: 0, d: { a: 1, b: 2 } }
      const fn = j.safeData
      expect(fn(obj, { a: 1 })).to.equal('')
      expect(fn(obj.a, 'a')).to.equal(undefined)
      expect(fn(obj, 'a')).to.equal(undefined)
      expect(fn(obj, 'd.a')).to.equal(1)
      expect(fn(obj, 'd.a.a', 2, 1)).to.equal(2)
      expect(fn(obj, 'a', 0)).to.equal(0)
      expect(fn(obj, 'b', 0)).to.equal(0)
      expect(fn(obj, 'b')).to.equal('')
      expect(fn(obj, 'c')).to.equal(0)
      expect(fn(obj, 'c', '')).to.equal('')
      expect(fn(obj, 'a', 'a', true)).to.equal('a')
    })
    it('setUrlParams', function () {
      const fn = j.setUrlParams
      expect(fn({ a: 1, b: 2 })).to.equal('?a=1&b=2')
      expect(fn({ a: 1 }, true)).to.equal('a=1')
      expect(fn({}, true)).to.equal('')
    })
    it('getUrlParam', function () {
      const fn = j.getUrlParam
      expect(fn('a', 'https://www.baidu.com?a=1')).to.equal('1')
      expect(fn('a', 'www.baidu.com/?b=2#/index?a=1')).to.equal('1')
      expect(fn('a', 'www.baidu.com/?a=2#/index?a=1')).to.equal('2#/index?a=1')
      expect(fn('b')).to.equal('')
    })
    it('getUrlParamObj', function () {
      const fn = j.getUrlParamObj
      expect(fn()).to.deep.equal({})
      expect(fn('https://www.baidu.com?a=1')).to.deep.equal({ a: '1' })
      expect(fn({})).to.deep.equal({})
      expect(fn('www.baidu.com/?b=2#/index?a=1').a).to.equal('1')
      expect(fn('www.baidu.com/?a=2&b=2#/index?a=1&b=2')).to.deep.equal({
        a: '1',
        b: '2',
      })
      expect(fn('www.baidu.com?a=1')).to.deep.equal({ a: '1' })
      expect(fn('www.baidu.com')).to.deep.equal({})
      expect(fn('a=1')).to.deep.equal({ a: '1' })
      expect(fn(false)).to.deep.equal({})
    })
    it('replaceUrlParam', function () {
      const fn = j.replaceUrlParam
      expect(fn('a', 1)).to.equal(
        '?a=1'
      )
      expect(fn('a', null, 'www.baidu.com?a=2&b=1')).to.equal(
        'www.baidu.com?b=1'
      )
      expect(fn('b', null, 'www.baidu.com?a=2&b=1')).to.equal(
        'www.baidu.com?a=2'
      )
      expect(fn('a', null, 'www.baidu.com?a=2')).to.equal(
        'www.baidu.com'
      )
      expect(fn('a', 1, 'www.baidu.com?a=2&b=1')).to.equal(
        'www.baidu.com?a=1&b=1'
      )
      expect(fn('a', 1, 'www.baidu.com?a=2')).to.equal('www.baidu.com?a=1')
      expect(fn('a', 1, 'www.baidu.com?a=')).to.equal('www.baidu.com?a=1')
      expect(fn('a', 1, 'www.baidu.com?b=2&a=')).to.equal(
        'www.baidu.com?b=2&a=1'
      )
      expect(fn('a', 1, 'www.baidu.com/#/index?a=2')).to.equal(
        'www.baidu.com/#/index?a=1'
      )
      expect(fn('a', 1, 'www.baidu.com/?b=2')).to.equal(
        'www.baidu.com/?b=2&a=1'
      )
      expect(fn('a', 1, 'www.baidu.com/#/index?b=2')).to.equal(
        'www.baidu.com/#/index?b=2&a=1'
      )
    })
    it('encodeHtml', function () {
      const fn = j.encodeHtml
      expect(fn()).to.equal('')
      expect(fn('<a href="https://baidu.com?a=1&b=2"></a>')).to.equal(
        '&lt;a&nbsp;href=&quot;https://baidu.com?a=1&amp;b=2&quot;&gt;&lt;/a&gt;'
      )
    })
    it('decodeHtml', function () {
      const fn = j.decodeHtml
      expect(
        fn(
          '&lt;a&nbsp;href=&quot;https://baidu.com?a=1&amp;b=2&quot;&gt;&lt;/a&gt;'
        )
      ).to.equal('<a href="https://baidu.com?a=1&b=2"></a>')
    })
    it('setTitle', function () {
      const fn = j.setTitle
      expect(fn('title')).to.equal(undefined)
    })
    it('rmbPrice', function () {
      const fn = j.rmbPrice
      expect(fn()).to.equal('--')
      expect(fn(1.55)).to.equal('￥1.55')
      expect(fn(1.55, 1)).to.equal('￥1.6')
    })
    it('formatTime', function () {
      const fn = j.formatTime
      expect(fn()).to.be.a('string')
      expect(fn(new Date('2022/11/12 00:00:00'))).to.equal(
        '2022-11-12 00:00:00'
      )
      expect(fn(new Date('2022/11/12 00:00:00'), 'YYYY')).to.equal('2022')
      expect(fn(new Date('2022/11/12 00:00:00'), 'YYYY-MM')).to.equal('2022-11')
      expect(fn(null, 'YYYY-MM', '--')).to.equal('--')
      expect(fn(0, 'YYYY-MM', '')).to.equal('1970-01')
      expect(fn(1646752738, 'YYYY-MM', '')).to.equal('2022-03')
      expect(fn(1646752738123, 'YYYY-MM S', '')).to.equal('2022-03 123')
      expect(fn(1646752738123, 'YYYY-MM E qq季度', '')).to.equal(
        '2022-03 周二 01季度'
      )
      expect(fn(1646752738123, 'YYYY-MM EE qq季度', '')).to.equal(
        '2022-03 星期二 01季度'
      )
    })
    it('friendlyTime', function () {
      const fn = j.friendlyTime
      expect(fn()).to.equal('刚刚')
      expect(fn({})).to.equal('--')
      expect(fn(Math.floor(+Date.now()/1000))).to.equal('刚刚')
      expect(fn(+Date.now() - 61 * 1000)).to.equal('1分钟前')
      expect(fn(+Date.now() - 121 * 1000)).to.equal('2分钟前')
      expect(fn(+Date.now() - 61 * 60 * 1000)).to.equal('1小时前')
      expect(fn(+Date.now() - 121 * 60 * 1000)).to.equal('2小时前')
      expect(fn(+Date.now() - 24 * 60 * 60 * 1000)).to.equal('昨天')
      expect(fn(+Date.now() - 2 * 24 * 60 * 60 * 1000)).to.equal('2天前')
      expect(fn(+Date.now() - 7 * 24 * 60 * 60 * 1000)).to.equal('1周前')
      expect(fn(+Date.now() - 35 * 24 * 60 * 60 * 1000)).to.equal('2月前')
      expect(fn('', '', '--')).to.equal('--')
      expect(fn(0, 'YYYY', '--')).to.equal('1970')
    })
    it('remInit', function () {
      const fn = j.remInit
      expect(fn()).to.equal(undefined)
    })
    it('isIdCard', function () {
      const fn = j.isIdCard
      expect(fn()).to.equal(false)
      expect(fn(4409)).to.equal(false)
      expect(fn('440921199011199999')).to.equal(false)
      expect(fn('490921199011199999')).to.equal(false)
      expect(fn('350525198512095316')).to.equal(true)
      expect(fn('441425196509103096')).to.equal(true)
    })
    it('getCookieMock', function () {
      const fn = j.getCookie
      expect(fn(1)).to.equal('')
      expect(fn('1')).to.equal('1')
      expect(fn('a')).to.equal('2')
      expect(fn('aa')).to.equal('')
    })
    it('setCookieMock', function () {
      const fn = j.setCookie
      expect(fn()).to.equal(undefined)
      expect(fn(1)).to.equal(undefined)
      expect(fn(1, 1)).to.equal(undefined)
      expect(fn(1, 1, 1)).to.equal(undefined)
    })
    it('delCookieMock', function () {
      const fn = j.delCookie
      expect(fn('1')).to.equal(undefined)
      expect(fn()).to.equal(undefined)
    })
    it('sleep', function () {
      const fn = j.sleep
      expect(fn(1000)).to.be.a('promise')
    })
    it('randomInt', function () {
      const fn = j.randomInt
      expect(fn()).to.be.a('number')
      expect(fn(0, 0)).to.be.a('number')
      expect(fn(1, 1)).to.equal(1)
    })
    it('isJson', function () {
      const fn = j.isJson
      expect(fn()).to.equal(false)
      expect(fn(1)).to.equal(false)
      expect(fn('{}')).to.equal(true)
    })
    it('isBlobMock', function () {
      const fn = j.isBlob
      expect(fn({ a: 1 })).to.equal(false)
      expect(fn(new Blob([1]))).to.equal(true)
    })
    it('isFileMock', function () {
      const fn = j.isFile
      expect(fn(1)).to.equal(false)
    })
    it('getUuid', function () {
      const fn = j.getUuid
      expect(fn()).to.be.a('string')
    })
    it('getInfoMock', function () {
      const fn = j.getInfo
      expect(fn()).to.be.a('object')
    })
    it('hideInfo', function () {
      const fn = j.hideInfo
      expect(fn()).to.equal('')
      expect(fn('123', 1, 1)).to.equal('1*3')
      expect(fn(123, 1, 1)).to.equal('1*3')
      expect(fn('12', 1, 1)).to.equal('12')
      expect(fn('15920385216')).to.equal('159****5216')
    })
    it('string10to62', function () {
      const fn = j.string10to62
      expect(fn(123)).to.equal('1Z')
    })
    it('string62to10', function () {
      const fn = j.string62to10
      expect(fn('1Z')).to.equal(123)
    })
    it('blobToBase64Mock', async function () {
      const fn = j.blobToBase64
      expect(await fn(new Blob([1]))).to.equal(undefined)
      expect(await fn()).to.equal(undefined)
    })
    it('toFixed', function () {
      const fn = j.toFixed
      expect(fn('a', 2, 'number')).to.equal(0)
      expect(fn(1, 2, 'number')).to.equal(1)
      expect(fn({})).to.equal('')
      expect(fn('a')).to.equal('')
      expect(fn(1.456)).to.equal('1.46')
      expect(fn(1.456, 1)).to.equal('1.5')
      expect(fn(1.0, 1)).to.equal('1.0')
      expect(fn(1.0, 1, 'number')).to.equal(1)
    })
    it('blobUrlToFileMock', async function () {
      const fn = j.blobUrlToFile
      expect(await fn(new Blob([1]))).to.equal('1')
      expect(fn()).to.be.rejectedWith()
      expect(fn(123)).to.be.rejectedWith()
    })
    it('getNetworkStatusMock', function () {
      const fn = j.getNetworkStatus
      expect(fn()).to.equal(true)
    })
    it('dataURLtoBlobMock', function () {
      const fn = j.dataURLtoBlob
      expect(fn('aGk=')).to.equal(false)
      expect(fn('aGk=')).to.equal(false)
      expect(j.isBlob(fn('data:image/jpeg;base64,/9j/4AAQSkZJ'))).to.equal(true)
    })
    it('blobToFileMock', function () {
      const fn = j.blobToFile
      expect(j.isBlob(fn(new Blob()))).to.equal(true)
    })
    it('dlFileMock', function () {
      const fn = j.dlFile
      expect(fn('hi')).to.equal(undefined)
      expect(fn(new Blob([1]))).to.equal(undefined)
    })
    it('loadFileMock', function () {
      const fn = j.loadFile
      expect(fn('www.baidu.com/a.js')).to.be.a('promise')
    })
    it('getRandomColor', function () {
      const fn = j.getRandomColor
      expect(fn()).to.be.a('string')
    })
    it('px2vw', function () {
      const fn = j.px2vw
      expect(fn(375)).to.equal('100vw')
      expect(fn(70,375)).to.equal('18.666667vw')
      expect(fn(70,375,2)).to.equal('18.67vw')
      expect(fn(70,375,2,'rem')).to.equal('18.67rem')
    })
    it('toLine', function () {
      const fn = j.toLine
      expect(fn('AbC')).to.equal('_ab_c')
      expect(fn('AbC','-')).to.equal('-ab-c')
    })
    it('toHump', function () {
      const fn = j.toHump
      expect(fn('_ab')).to.equal('Ab')
      expect(fn('_ab-c','-')).to.equal('_abC')
    })
    it('setStorageMock', function () {
      const fn = j.setStorage
      expect(fn('key','1')).to.equal('1')
      expect(fn('key',{})).to.equal('{}')
    })
    it('getStorageMock', function () {
      const fn = j.getStorage
      expect(fn('key')).to.equal('key')
      expect(fn('')).to.equal('')
      expect(fn('{}')).to.be.a('object')
    })
    it('secondToTime', function () {
      const fn = j.secondToTime
      expect(fn(1)).to.equal('01秒')
      expect(fn(60)).to.equal('01分00秒')
      expect(fn(70,'s')).to.equal('70秒')
      expect(fn(70,'s',{unit:['Y','M','d','h','m','s']})).to.equal('70s')
      expect(fn(3600)).to.equal('01时00分00秒')
      expect(fn(103600)).to.equal('01天04时46分40秒')
      expect(fn(1103600)).to.equal('12天18时33分20秒')
      expect(fn(11103600)).to.equal('04月08天12时20分00秒')
      expect(fn(51103600)).to.equal('01年07月21天11时26分40秒')
    })
    it('formatSize', function () {
      const fn = j.formatSize
      expect(fn(1)).to.equal('1B')
      expect(fn()).to.equal('0B')
      expect(fn(1100)).to.equal('1.07K')
      expect(fn(1100,3)).to.equal('1.074K')
      expect(fn(1100,3,1)).to.equal('1.074M')
      expect(fn(1100,3,1,1000)).to.equal('1.1M')
      expect(fn(1100,3,1,1000,['b','k','m','g','t','p'])).to.equal('1.1m')
      expect(fn(11111111110000000)).to.equal('9.87P')
    })
    it('formatNumber', function () {
      const fn = j.formatNumber
      expect(fn(1)).to.equal(1)
      expect(fn(1000)).to.equal('1k')
      expect(fn(1900)).to.equal('1.9k')
      expect(fn(10000)).to.equal('1w')
      expect(fn(9000)).to.equal('9k')
      expect(fn(10110)).to.equal('1.01w')
    })
    it('getDuration', function () {
      const fn = j.getDuration
      expect(fn()).to.be.a('promise')
      expect(fn('www.baidu.com')).to.be.a('promise')
    })
    it('isPrime', function () {
      const fn = j.isPrime
      expect(fn(1)).to.equal(false)
      expect(fn(2)).to.equal(true)
      expect(fn(3)).to.equal(true)
      expect(fn(7)).to.equal(true)
    })
    // it('demo', function () {
    //   const fn = j.demo
    //   expect(fn()).to.equal('1')
    // })
  })
})
