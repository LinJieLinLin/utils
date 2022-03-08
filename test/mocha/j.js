/*
import { getRegexp } from './../j';
import { safeData } from 'lj-utils/j';
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-01-21 11:54:25
 * @description: no
 */
import { expect } from 'chai'
import j from '../../index'

describe('j.js', function () {
  before(function () {
    global.window = {
      location: {},
      document: {
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
      expect(fn(1.55,1)).to.equal('￥1.6')
    })
    it('formatTime', function () {
      const fn = j.formatTime
      expect(fn(new Date('2022/11/12 00:00:00'))).to.equal('2022-11-12 00:00:00')
      expect(fn(new Date('2022/11/12 00:00:00'),'YYYY')).to.equal('2022')
      expect(fn(new Date('2022/11/12 00:00:00'),'YYYY-MM')).to.equal('2022-11')
      expect(fn(null,'YYYY-MM','--')).to.equal('--')
      expect(fn(0,'YYYY-MM','')).to.equal('1970-01')
      expect(fn(1646752738,'YYYY-MM','')).to.equal('2022-03')
      expect(fn(1646752738123,'YYYY-MM S','')).to.equal('2022-03 123')
      expect(fn(1646752738123,'YYYY-MM E qq季度','')).to.equal('2022-03 周二 01季度')
    })
    it('friendlyTime', function () {
      const fn = j.friendlyTime
      expect(fn()).to.equal('刚刚')
      expect(fn(+Date.now()-61*1000)).to.equal('1分钟前')
      expect(fn(+Date.now()-121*1000)).to.equal('2分钟前')
      expect(fn(+Date.now()-61*60*1000)).to.equal('1小时前')
      expect(fn(+Date.now()-121*60*1000)).to.equal('2小时前')
      expect(fn(+Date.now()-24*60*60*1000)).to.equal('昨天')
      expect(fn(+Date.now()-2*24*60*60*1000)).to.equal('2天前')
      expect(fn(+Date.now()-7*24*60*60*1000)).to.equal('1周前')
      expect(fn('','','--')).to.equal('--')
      expect(fn(0,'YYYY','--')).to.equal('1970')
    })
    it('remInit', function () {
      const fn = j.remInit
      expect(fn()).to.equal(undefined)
    })
    // it('demo', function () {
    //   const fn = j.demo
    //   expect(fn()).to.equal('1')
    // })
  })
})
