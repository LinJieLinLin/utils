/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-12 09:11:14
 * @description: no
 */
import * as j from '../data'
describe('data', () => {
  it('safeData', function () {
    const obj: { [key: string]: any } = { b: '', c: 0, d: { a: 1, b: 2 } }
    const fn = j.safeData
    expect(fn(obj.a, 'a')).toBe(undefined)
    expect(fn(obj, 'a')).toBe(undefined)
    expect(fn(obj, 'd.a')).toBe(1)
    expect(fn(obj, 'd.a.a', 2, 1)).toBe(2)
    expect(fn(obj, 'a', 0)).toBe(0)
    expect(fn(obj, 'b', 0)).toBe(0)
    expect(fn(obj, 'b')).toBe('')
    expect(fn(obj, 'c')).toBe(0)
    expect(fn(obj, 'c', '')).toBe('')
    expect(fn(obj, 'a', 'a', true)).toBe('a')
  })
  it('toFixed', function () {
    const fn = j.toFixed
    expect(fn('a', 2, 'number')).toBe(0)
    expect(fn(1, 2, 'number')).toBe(1)
    expect(fn('a')).toBe('0.00')
    expect(fn(1.456)).toBe('1.46')
    expect(fn(1.456, 1)).toBe('1.5')
    expect(fn(1.0, 1)).toBe('1.0')
    expect(fn(1.0, 1, 'number')).toBe(1)
  })
  it('toLine', function () {
    const fn = j.toLine
    expect(fn('AbC')).toBe('_ab_c')
    expect(fn('AbC', '-')).toBe('-ab-c')
  })
  it('toHump', function () {
    const fn = j.toHump
    expect(fn('_ab')).toBe('Ab')
    expect(fn('_ab-c', '-')).toBe('_abC')
  })
  it('string10to62', function () {
    const fn = j.string10to62
    expect(fn(123)).toBe('1Z')
  })
  it('string62to10', function () {
    const fn = j.string62to10
    expect(fn('1Z')).toBe(123)
  })
  it('setUrlParams', function () {
    const fn = j.setUrlParams
    expect(fn({ a: 1, b: 2 })).toBe('?a=1&b=2')
    expect(fn({ a: 1 }, true)).toBe('a=1')
    expect(fn({}, true)).toBe('')
  })
  it('getUrlParam', function () {
    const fn = j.getUrlParam
    expect(fn('a', 'https://www.baidu.com?a=1')).toBe('1')
    expect(fn('a', 'www.baidu.com/?b=2#/index?a=1')).toBe('1')
    expect(fn('a', 'www.baidu.com/?a=2#/index?a=1')).toBe('2#/index?a=1')
    expect(fn('b')).toBe('')
  })
  it('getUrlParamObj', function () {
    const fn = j.getUrlParamObj
    console.log(globalThis.location.search)
    expect(fn()).toStrictEqual({})
    expect(fn('https://www.baidu.com?a=1')).toStrictEqual({ a: '1' })
    expect(fn('www.baidu.com/?b=2#/index?a=1').a).toBe('1')
    expect(fn('www.baidu.com/?a=2&b=2#/index?a=1&b=2')).toStrictEqual({
      a: '1',
      b: '2',
    })
    expect(fn('www.baidu.com?a=1')).toStrictEqual({ a: '1' })
    expect(fn('www.baidu.com')).toStrictEqual({})
    expect(fn('a=1')).toStrictEqual({ a: '1' })
  })
  it('replaceUrlParam', function () {
    const fn = j.replaceUrlParam
    expect(fn('a', '1', '')).toBe('?a=1')
    expect(fn('a', null, 'www.baidu.com?a=2&b=1')).toBe('www.baidu.com?b=1')
    expect(fn('a', undefined, 'www.baidu.com?a=2&b=1')).toBe(
      'www.baidu.com?b=1'
    )
    expect(fn('b', null, 'www.baidu.com?a=2&b=1')).toBe('www.baidu.com?a=2')
    expect(fn('a', null, 'www.baidu.com?a=2')).toBe('www.baidu.com')
    expect(fn('a', 1, 'www.baidu.com?a=2&b=1')).toBe('www.baidu.com?a=1&b=1')
    expect(fn('a', 1, 'www.baidu.com?a=2')).toBe('www.baidu.com?a=1')
    expect(fn('a', 1, 'www.baidu.com?a=')).toBe('www.baidu.com?a=1')
    expect(fn('a', 1, 'www.baidu.com?b=2&a=')).toBe('www.baidu.com?b=2&a=1')
    expect(fn('a', 1, 'www.baidu.com/#/index?a=2')).toBe(
      'www.baidu.com/#/index?a=1'
    )
    expect(fn('a', 1, 'www.baidu.com/?b=2')).toBe('www.baidu.com/?b=2&a=1')
    expect(fn('a', 1, 'www.baidu.com/#/index?b=2')).toBe(
      'www.baidu.com/#/index?b=2&a=1'
    )
  })
  it('encodeHtml', function () {
    const fn = j.encodeHtml
    expect(fn('')).toBe('')
    expect(fn('<a href="https://baidu.com?a=1&b=2"></a>')).toBe(
      '&lt;a&nbsp;href=&quot;https://baidu.com?a=1&amp;b=2&quot;&gt;&lt;/a&gt;'
    )
  })
  it('decodeHtml', function () {
    const fn = j.decodeHtml
    expect(
      fn(
        '&lt;a&nbsp;href=&quot;https://baidu.com?a=1&amp;b=2&quot;&gt;&lt;/a&gt;'
      )
    ).toBe('<a href="https://baidu.com?a=1&b=2"></a>')
  })
  it('hideInfo', function () {
    const fn = j.hideInfo
    expect(fn()).toBe('')
    expect(fn('123', 1, 1)).toBe('1*3')
    expect(fn(123, 1, 1)).toBe('1*3')
    expect(fn('12', 1, 1)).toBe('12')
    expect(fn('15920385216')).toBe('159****5216')
  })
  it('getUuid', function () {
    const fn = j.getUuid
    expect(typeof fn()).toBe('string')
  })
  it('randomInt', function () {
    const fn = j.randomInt
    expect(typeof fn()).toBe('number')
    expect(typeof fn(0, 0)).toBe('number')
    expect(fn(1, 1)).toBe(1)
  })
})
