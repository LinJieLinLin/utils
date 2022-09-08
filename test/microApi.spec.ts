/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-16 20:52:48
 * @description: no
 */
import * as j from '../microApi'
describe('microApi', () => {
  it('init', function () {
    const fn = j.init
    expect(fn()).toBe(undefined)
  })
  it('getDb', function () {
    const fn = j.getDb
    expect(typeof fn()).toBe('object')
  })
  it('showLoading', function () {
    const fn = j.showLoading
    expect(fn()).toBe(undefined)
  })
  it('hideLoading', function () {
    const fn = j.hideLoading
    expect(fn()).toBe(undefined)
  })
  it('setRequest', function () {
    const fn = j.setRequest
    expect(
      fn(
        () => {},
        () => {}
      )
    ).toBe(undefined)
  })
  it('checkUpdate', function () {
    const fn = j.checkUpdate
    expect(fn()).toBe(undefined)
  })
  it('scrollTop', function () {
    const fn = j.scrollTop
    expect(fn()).rejects.toBe('无此方法')
  })
  it('toast', function () {
    const fn = j.toast
    expect(fn('test')).rejects.toBe('无此方法')
  })
  it('setTitle', function () {
    const fn = j.setTitle
    expect(fn('title')).toBe(undefined)
  })
  // it('toPage', function () {
  //   const fn = j.toPage
  //   expect(fn('title')).toBe(undefined)
  // })
  it('getCurrentPage', function () {
    const fn = j.getCurrentPage
    expect(fn()).toStrictEqual({})
  })
  it('getCurrentPageUrl', function () {
    const fn = j.getCurrentPageUrl
    expect(fn()).toBe('')
  })
  it('downloadImgs', function () {
    const fn = j.downloadImgs
    expect(fn(1)).rejects.toBe(false)
  })
  it('getSystemInfo', function () {
    const fn = j.getSystemInfo
    expect(fn()).toBeDefined()
  })
})
