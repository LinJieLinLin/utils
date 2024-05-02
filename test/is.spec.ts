import * as j from '../src/is'
const isIdCard = j.isIdCard
describe('is', () => {
  it('isJson', function () {
    const fn = j.isJson
    expect(fn(1)).toBe(false)
    expect(fn('{}')).toBe(true)
  })
  it('isBlobMock', function () {
    const fn = j.isBlob
    expect(fn({ a: 1 })).toBe(false)
    expect(fn(new Blob(['1']))).toBe(true)
  })
  it('isFileMock', function () {
    const fn = j.isFile
    expect(fn(1)).toBe(false)
  })
  it('isIdCard', function () {
    const fn = j.isIdCard
    expect(fn('440921199909099999')).toBe(false)
    expect(fn('4409211999090999ab')).toBe(false)
    expect(fn('110101199003070')).toBe(false)
  })
})
describe('isIdCard function', () => {
  it('should return false for invalid ID card format', () => {
    expect(isIdCard('320311770706001')).toBe(false)
  })

  it('should return false for invalid city code', () => {
    // 无效的地址编码
    expect(isIdCard('999999199001011111')).toBe(false)
    // 地址编码不存在的情况
    expect(isIdCard('990123199001011111')).toBe(false)
  })

  it('should return false for invalid checksum', () => {
    // 18位身份证号码：34012319900101111X
    // 此处修改最后一位校验位，使其与前17位不匹配，测试校验位是否能够正确判断
    expect(isIdCard('340123199001011119')).toBe(false)
  })

  it('should return true for valid ID card', () => {
    // 有效的身份证号码
    expect(isIdCard('610123197001011234')).toBe(true)
  })

  it('should return false for empty input', () => {
    // 空输入
    expect(isIdCard('')).toBe(false)
    // @ts-ignore
    expect(isIdCard(null)).toBe(false)
    // @ts-ignore
    expect(isIdCard(undefined)).toBe(false)
  })
})
