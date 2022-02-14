/*
import { getRegexp } from './../j';
import { safeData } from 'lj-utils/j';
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-01-21 11:54:25
 * @description: no
 */
var expect = require('chai').expect
const { getRegexp, safeData, setUrlParams, getUrlParam } = require('../../j')

describe('j.js', function () {
  before(function () {})

  after(function () {
    // runs after all tests in this block
  })

  beforeEach(function () {
    // runs before each test in this block
  })

  afterEach(function () {
    // runs after each test in this block
  })
  describe('j.js', function () {
    it('getRegexp', function () {
      const regexp = getRegexp()
      expect(regexp).to.be.a('object')
    })
    it('safeData', function () {
      const obj = { b: '', c: 0, d: { a: 1, b: 2 } }
      expect(safeData(obj, { a: 1 })).to.equal('')
      expect(safeData(obj.a, 'a')).to.equal(undefined)
      expect(safeData(obj, 'a')).to.equal(undefined)
      expect(safeData(obj, 'd.a')).to.equal(1)
      expect(safeData(obj, 'd.a.a', 2, 1)).to.equal(2)
      expect(safeData(obj, 'a', 0)).to.equal(0)
      expect(safeData(obj, 'b', 0)).to.equal(0)
      expect(safeData(obj, 'b')).to.equal('')
      expect(safeData(obj, 'c')).to.equal(0)
      expect(safeData(obj, 'c', '')).to.equal('')
      expect(safeData(obj, 'a', 'a', true)).to.equal('a')
    })
    it('setUrlParams', function () {
      expect(setUrlParams({ a: 1, b: 2 })).to.equal('?a=1&b=2')
      expect(setUrlParams({ a: 1 }, true)).to.equal('a=1')
      expect(setUrlParams({}, true)).to.equal('')
    })
    it('getUrlParam', function () {
      expect(getUrlParam('a', 'www.baidu.com?a=1')).to.equal('1')
      expect(getUrlParam('b', 'www.baidu.com?a=1')).to.equal('')
    })
  })
})
