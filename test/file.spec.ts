/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-12 11:20:33
 * @description: no
 */
import * as j from '../src/index'
import { isBlob } from '../src/is'
import { jest } from '@jest/globals'

describe('file', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn((blob): string => {
      return String(blob)
    })
    // window.URL.createObjectURL = jest.fn()
    window.URL.revokeObjectURL = jest.fn()
  })
  it('blobToBase64', async function () {
    const fn = j.blobToBase64
    expect(await fn(new Blob(['1']))).toBe(
      'data:application/octet-stream;base64,MQ=='
    )
  })
  it('blobUrlToFileMock', async function () {
    const fn = j.blobUrlToFile
    global.URL.createObjectURL = jest.fn((blob): string => {
      return String(blob)
    })
    expect(fn(URL.createObjectURL(new Blob(['1'])))).resolves.toBe({})
  })
  it('dataURLtoBlob', function () {
    const fn = j.dataURLtoBlob
    expect(isBlob(fn('aGk='))).toBe(true)
    expect(j.isBlob(fn('data:image/jpeg;base64,/9j/4AAQSkZJ'))).toBe(true)
  })
  it('blobToFile', function () {
    const fn = j.blobToFile
    expect(j.isBlob(fn(new Blob()))).toBe(true)
  })
  it('dlFileMock', function () {
    const fn = j.dlFile
    expect(fn('hi')).toBe(undefined)
    expect(fn(new Blob(['1']))).toBe(undefined)
  })
  it('getDuration', function () {
    const fn = j.getDuration
    expect(fn(new Blob(['1']))).resolves.toBe(true)
    expect(fn('www.baidu.com')).resolves.toBe(true)
  })
  it('loadFileMock', function () {
    const fn = j.loadFile
    expect(fn('www.baidu.com/a.js')).resolves.toBe(true)
  })
})
