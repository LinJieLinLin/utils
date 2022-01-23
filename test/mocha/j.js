/*
import { getRegexp } from './../j';
import { safeData } from 'lj-utils/j';
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-01-21 11:54:25
 * @description: no
 */
var expect = require('chai').expect
const { getRegexp, safeData, setUrlParams } = require('../../j')

describe('j.js', function () {
  before(function () {
    global.window = {}
  })

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
      const obj = { b: '', c: 0 }
      expect(safeData(obj, 'a')).to.equal(undefined)
      expect(safeData(obj, 'a', 0)).to.equal(0)
      expect(safeData(obj, 'b', 0)).to.equal(0)
      expect(safeData(obj, 'b')).to.equal('')
      expect(safeData(obj, 'c')).to.equal(0)
      expect(safeData(obj, 'c', '')).to.equal('')
      expect(safeData(obj, 'a', 'a', true)).to.equal('a')
    })
    it('setUrlParams', function () {
      expect(setUrlParams({ a: 1 })).to.equal('?a=1')
      expect(setUrlParams({ a: 1 }, true)).to.equal('a=1')
      expect(setUrlParams({}, true)).to.equal('')
    })
  })
})
