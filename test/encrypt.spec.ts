/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-12 16:34:42
 * @description: no
 */
import * as j from '../src/encrypt/crypto'
import * as base64 from '../src/encrypt/base64'
describe('encrypt', () => {
  it('md5', function () {
    const fn = j.md5
    expect(fn('1')).toBe('c4ca4238a0b923820dcc509a6f75849b')
  })
  it('enBase64', function () {
    const fn = j.enBase64
    expect(fn('1')).toBe('MQ==')
    expect(base64.enBase64('1')).toBe('MQ==')
  })
  it('deBase64', function () {
    const fn = j.deBase64
    expect(fn('MQ==')).toBe('1')
    expect(base64.deBase64('MQ==')).toBe('1')
  })
  it('encode', function () {
    const fn = j.encode
    expect(fn('1')).toBe('MQ==')
  })
  it('decode', function () {
    const fn = j.decode
    expect(fn('MQ==')).toBe('1')
  })
  it('key by', function () {
    const fn = j.enAes
    expect(j.deAes(fn('china'))).toBe('china')
    expect(j.decode(j.encode('china', 'aes'), 'aes')).toBe('china')
  })
  it('aesInit', function () {
    const fn = j.aesInit
    expect(j.deAes(j.enAes('china'))).toBe('china')
    expect(j.decode(j.encode('china', 'aes'), 'aes')).toBe('china')
    let temEncode = j.enAes('china')
    expect(fn('key', 'key123')).toBe(undefined)
    expect(j.deAes(temEncode)).not.toBe('china')
  })
})
