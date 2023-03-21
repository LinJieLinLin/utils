/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-11 22:51:15
 * @description: no
 */
import * as j from '../src/base'
describe('base', () => {
  it('getRegexp', function () {
    const regexp = j.getRegexp()
    expect(regexp).toBeDefined()
  })
  it('setTitle', function () {
    const fn = j.setTitle
    expect(fn('title')).toBe(undefined)
  })
  it('remInit', function () {
    const fn = j.remInit
    expect(fn()).toBe(undefined)
  })
  it('setCookie', function () {
    const fn = j.setCookie
    expect(fn('1')).toBe(undefined)
    expect(fn('1', 1)).toBe(undefined)
    expect(fn('a', 1, 1)).toBe(undefined)
  })
  it('getCookie', function () {
    const fn = j.getCookie
    expect(fn('1')).toBe('')
    expect(fn('a')).toBe('')
    expect(fn('aa')).toBe('')
  })
  it('delCookie', function () {
    const fn = j.delCookie
    expect(fn('1')).toBe(undefined)
    expect(fn()).toBe(undefined)
  })
  it('getInfoMock', function () {
    const fn = j.getInfo
    expect(fn()).toBeDefined()
  })
  it('getRandomColor', function () {
    const fn = j.getRandomColor
    expect(fn()).toBeDefined()
  })
  it('setStorage', function () {
    const fn = j.setStorage
    expect(fn('1', '1')).toBe('1')
    expect(fn('obj', {})).toBe('{}')
    expect(fn('key', 'key')).toBe('key')
  })
  it('getStorage', function () {
    const fn = j.getStorage
    expect(fn('key')).toBe('key')
    expect(fn('')).toBe('')
    expect(fn('{}')).toBe('')
  })
  it('sleep', function () {
    const fn = j.sleep
    expect(fn(1000)).resolves.toBe(true)
  })
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
    const safe = j.safe
    expect(safe({ a: { b: { c: { d: 1, e: 2 } } } }, 'a.b.c.d', 1)).toBe(1)
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
    expect(fn('www.baidu.com/?b=2#/index?a=1').a).toBe(undefined)
    expect(fn('www.baidu.com/?a=2&b=2#/index?a=1&b=2')).toStrictEqual({
      a: '2',
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
  it('setEnv', function () {
    expect(j.getEnv('a')).toBe('')
    j.setEnv({ a: 1, b: 2 })
    expect(j.getEnv('a')).toBe(1)
    expect(j.getEnv('c')).toBe('')
    expect(j.getEnv('b')).toBe(2)
  })
  it('deepCopy', function () {
    expect(j.deepCopy(1)).toBe(1)
    expect(j.deepCopy('hello')).toBe('hello')
    expect(j.deepCopy(null)).toBe(null)
    expect(j.deepCopy(undefined)).toBe(undefined)
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: [3, 4],
      },
    }
    const copy = j.deepCopy(obj)
    expect(copy).toEqual(obj)
    expect(copy).not.toBe(obj)
    expect(copy.b).not.toBe(obj.b)
    expect(copy.b.d).not.toBe(obj.b.d)
  })
})
