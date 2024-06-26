/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-11 22:51:15
 * @description: no
 */
import * as j from '../src/base'
describe('deepCopy function', () => {
  it('should copy primitive types', () => {
    expect(j.deepCopy(1)).toEqual(1)
    expect(j.deepCopy('string')).toEqual('string')
    expect(j.deepCopy(true)).toEqual(true)
  })

  it('should copy Date objects', () => {
    const date = new Date()
    const copiedDate = j.deepCopy(date)
    expect(copiedDate).toEqual(date)
    expect(copiedDate).not.toBe(date)
  })

  it('should copy RegExp objects', () => {
    const regex = /test/g
    const copiedRegex = j.deepCopy(regex)
    expect(copiedRegex).toEqual(regex)
    expect(copiedRegex).not.toBe(regex)
  })

  it('should copy Map objects', () => {
    const map = new Map().set('key', 'value')
    const copiedMap = j.deepCopy(map)
    expect(copiedMap).toEqual(map)
    expect(copiedMap).not.toBe(map)
  })

  it('should copy Set objects', () => {
    const set = new Set().add('value')
    const copiedSet = j.deepCopy(set)
    expect(copiedSet).toEqual(set)
    expect(copiedSet).not.toBe(set)
  })

  it('should copy array objects', () => {
    const array = [1, 2, 3]
    const copiedArray = j.deepCopy(array)
    expect(copiedArray).toEqual(array)
    expect(copiedArray).not.toBe(array)
  })

  it('should copy plain objects', () => {
    const obj = { key: 'value' }
    const copiedObj = j.deepCopy(obj)
    expect(copiedObj).toEqual(obj)
    expect(copiedObj).not.toBe(obj)
  })
})
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
    expect(fn('1')).toBe('1')
    expect(fn('a')).toBe('1')
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
    const obj: { [key: string]: any } = {
      b: '',
      c: 0,
      d: { a: 1, b: 2, c: 0 },
      e: false,
    }
    const fn = j.safeData
    expect(fn(obj.a, 'a')).toBe(undefined)
    expect(fn(obj, 'a')).toBe(undefined)
    expect(fn(obj, 'd.a')).toBe(1)
    expect(fn(obj, 'd.a', 2, 1)).toBe(true)
    expect(fn(obj, 'd.a')).toBe(2)
    expect(fn(obj, 'd.a.a', 2, 1)).toBe(false)
    expect(fn(obj, 'a', 0)).toBe(0)
    expect(fn(obj, 'b', 0)).toBe('')
    expect(fn(obj, 'c', false)).toBe(0)
    expect(fn(obj, 'b')).toBe('')
    expect(fn(obj, 'c')).toBe(0)
    expect(fn(obj, 'c', '')).toBe(0)
    expect(fn(obj, 'a', 'a', true)).toBe(true)
    expect(fn(obj, 'c.a.a', '1')).toBe('1')
    expect(fn(obj, 'd.c')).toBe(0)
    expect(fn(obj, 'c.a.a.a', '1', true)).toBe(false)
    expect(fn(obj, 'c.a.a.a', '2', true)).toBe(false)
    const safe = j.safe
    const objS = { a: { b: { c: { d: 1, e: 2 } } }, aa: null }
    expect(safe(objS, 'a.b.c.d', 1)).toBe(1)
    expect(safe(objS, 'aa')).toBe(null)
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
  it('setObj,getObj', function () {
    j.setObj('', { a: 1, b: 2, c: 3 })
    expect(j.getObj('a')).toBe(1)
    j.setObj('a', { a: 1 })
    expect(j.getObj('a')?.a).toBe(1)
    expect(j.getObj('')).toStrictEqual({})
    expect(j.getObj('a')?.b).toBe(undefined)
    expect(j.getObj('a', { b: 2 })?.b).toStrictEqual(2)
    expect(j.getObj('a')?.b).toBe(2)
    expect(j.getObj('a', { b: 3, c: 3 }, true)?.b).toBe(3)
    expect(j.getObj('a')?.b).toBe(2)
  })
  it('setLog', function () {
    setTimeout(function () {
      // @ts-ignore
      globalThis.DeviceMotionEvent = undefined
      j.setLog(1)
      j.setLog(2)
      j.setLog(3)
      j.setLog(4)
      j.setLog(5, { error: 0 })
      j.requestDeviceMotionPermission()
    }, 3000)
  })
  it('debounce', async () => {
    let runCount = 0
    const a = {
      name: 'lin',
    }
    const fn = function (...arg: any[]) {
      runCount++
      // console.log('-------------------')
      // console.log(arg, this.name)
      return typeof arg
    }
    const fnT = fn.bind(a)
    const dbFn = j.debounce(fnT, 200, 1, 2)
    dbFn()
    dbFn()
    expect(runCount).toBe(0)
    await j.sleep(301)
    dbFn(3, 4)
    expect(runCount).toBe(1)
  })
  it('throttle', async function () {
    let runCount = 0
    let argList: any[] = []
    const fn = (...arg: any[]) => {
      runCount++
      argList = arg
      // console.log('-------------------')
      // console.log(runCount, arg)
      return typeof arg
    }
    const trFn = j.throttle(fn, 1000, 1, 2, 3)
    trFn(4)
    trFn(5)
    expect(runCount).toBe(1)
    expect(argList).toStrictEqual([4, 1, 2, 3])
    const trFn1 = j.throttle(fn)
    trFn1(1)
    trFn1(4)
    trFn1(4)
    trFn1(4)
    trFn1(4)
    trFn1(4)
    trFn1(4)
    await j.sleep(303)
    trFn1(2)
    expect(runCount).toBe(3)
    expect(argList).toStrictEqual([2])
    await j.sleep(304)
    trFn1(3)
    trFn1(4)
    trFn1(4)
    trFn1(4)
    trFn1(4)
    trFn1(4)
    trFn1(4)
    expect(runCount).toBe(4)
    expect(argList).toStrictEqual([3])
  })
})
