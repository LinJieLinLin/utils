import * as j from '../index'
describe('add function', () => {
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
})
