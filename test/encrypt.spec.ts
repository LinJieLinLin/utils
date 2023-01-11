/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-12 16:34:42
 * @description: no
 */
import * as j from '../src/encrypt/crypto'
// import * as b from '../src/encrypt/base64'

describe('encrypt', () => {
  it('md5', function () {
    const fn = j.md5
    expect(fn('1')).toBe('c4ca4238a0b923820dcc509a6f75849b')
  })
  it('enBase64', function () {
    const fn = j.enBase64
    expect(fn('1')).toBe('MQ==')
    // expect(b.enBase64('1')).toBe('MQ==')
  })
  it('deBase64', function () {
    const fn = j.deBase64
    expect(fn('MQ==')).toBe('1')
    // expect(b.deBase64('MQ==')).toBe('1')
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
    expect(j.deAes(fn('中国'))).toBe('中国')
    expect(j.decode(j.encode('中国', 'aes'), 'aes')).toBe('中国')
  })
  it('aesInit', function () {
    const fn = j.aesInit
    expect(j.deAes(j.enAes('中国'))).toBe('中国')
    expect(j.decode(j.encode('中国', 'aes'), 'aes')).toBe('中国')
    let temEncode = j.enAes('中国')
    expect(fn('key', 'key123')).toBe(undefined)
    expect(j.deAes(temEncode)).not.toBe('中国')
  })
})
