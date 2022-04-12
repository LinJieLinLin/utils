/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-11 22:51:15
 * @description: no
 */
import * as j from '../base'
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
})
