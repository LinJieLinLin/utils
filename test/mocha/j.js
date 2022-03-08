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
        getElementsByTagName:()=>[{innerText:''}]
      }
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
    })
    // it('demo', function () {
    //   const fn = j.demo
    //   expect(fn()).to.equal('1')
    // })
  })
})
