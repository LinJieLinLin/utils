/*
import { getRegexp } from './../j';
import { safeData } from 'lj-utils/j';
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-01-21 11:54:25
 * @description: no
 */
import { expect } from 'chai';
import j from '../../index';
const {
  Blob,
} = require('buffer');
describe('j.js', function () {
  before(function () {
    global.Blob = Blob
    global.File = Blob
    global.window = {
      location: {},
      navigator:{
        userAgent:'sbb msie mobile',
        userAgentData:{
          platform:'msie'
        }
      },
      document: {
        cookie: 'uid=1; 1=1; a=2; b=B; c=c',
        getElementsByTagName: () => [{ innerText: '' }],
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
      expect(fn('b', 'www.baidu.com?a=1')).to.equal('')
    })
    it('getUrlParamObj', function () {
      const fn = j.getUrlParamObj
      expect(fn('https://www.baidu.com?a=1')).to.deep.equal({ a: '1' })
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
      expect(fn(1.55)).to.equal('￥1.55')
      expect(fn(1.55, 1)).to.equal('￥1.6')
    })
    it('formatTime', function () {
      const fn = j.formatTime
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
    })
    it('friendlyTime', function () {
      const fn = j.friendlyTime
      expect(fn()).to.equal('刚刚')
      expect(fn(+Date.now() - 61 * 1000)).to.equal('1分钟前')
      expect(fn(+Date.now() - 121 * 1000)).to.equal('2分钟前')
      expect(fn(+Date.now() - 61 * 60 * 1000)).to.equal('1小时前')
      expect(fn(+Date.now() - 121 * 60 * 1000)).to.equal('2小时前')
      expect(fn(+Date.now() - 24 * 60 * 60 * 1000)).to.equal('昨天')
      expect(fn(+Date.now() - 2 * 24 * 60 * 60 * 1000)).to.equal('2天前')
      expect(fn(+Date.now() - 7 * 24 * 60 * 60 * 1000)).to.equal('1周前')
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
    it('getCookie', function () {
      const fn = j.getCookie
      expect(fn(1)).to.equal('')
      expect(fn('1')).to.equal('1')
      expect(fn('a')).to.equal('2')
      expect(fn('aa')).to.equal('')
    })
    it('setCookie', function () {
      const fn = j.setCookie
      expect(fn()).to.equal(undefined)
      expect(fn(1)).to.equal(undefined)
      expect(fn(1, 1)).to.equal(undefined)
      expect(fn(1, 1, 1)).to.equal(undefined)
    })
    it('delCookie', function () {
      const fn = j.delCookie
      expect(fn('1')).to.equal(undefined)
    })
    it('sleep', function () {
      const fn = j.sleep
      expect(fn(1000)).to.be.a('promise')
    })
    it('randomInt', function () {
      const fn = j.randomInt
      expect(fn(0,0)).to.be.a('number')
      expect(fn(1,1)).to.equal(1)
    })
    it('isJson', function () {
      const fn = j.isJson
      expect(fn()).to.equal(false)
      expect(fn(1)).to.equal(false)
      expect(fn('{}')).to.equal(true)
    })
    it('isBlob', function () {
      const fn = j.isBlob
      expect(fn(1)).to.equal(false)
      expect(fn(new Blob([1]))).to.equal(true)
    })
    it('isFile', function () {
      const fn = j.isFile
      expect(fn(1)).to.equal(false)
      expect(fn(new Blob([1]))).to.equal(true)
    })
    it('getUuid', function () {
      const fn = j.getUuid
      expect(fn()).to.be.a('string')
    })
    it('getInfo', function () {
      const fn = j.getInfo
      expect(fn()).to.be.a('object')
    })
    it('hideInfo', function () {
      const fn = j.hideInfo
      expect(fn()).to.equal('')
      expect(fn('123',1,1)).to.equal('1*3')
      expect(fn('12',1,1)).to.equal('12')
      expect(fn('15920385216')).to.equal('159****5216')
    })
    // it('demo', function () {
    //   const fn = j.demo
    //   expect(fn()).to.equal('1')
    // })
  })
})
