/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-12 10:58:56
 * @description: no
 */
import * as j from '../transform'
describe('transform', () => {
  it('rmbPrice', function () {
    const fn = j.rmbPrice
    expect(fn({})).toBe('--')
    expect(fn(1.55)).toBe('￥1.55')
    expect(fn(1.55, 1)).toBe('￥1.6')
  })
  it('formatTime', function () {
    const fn = j.formatTime
    expect(typeof fn()).toBe('string')
    expect(fn(new Date('2022/11/12 00:00:00'))).toBe('2022-11-12 00:00:00')
    expect(fn(new Date('2022/11/12 00:00:00'), 'YYYY')).toBe('2022')
    expect(fn(new Date('2022/11/12 00:00:00'), 'YYYY-MM')).toBe('2022-11')
    expect(fn('', 'YYYY-MM', '--')).toBe('--')
    expect(fn(0, 'YYYY-MM', '')).toBe('1970-01')
    expect(fn(1646752738, 'YYYY-MM', '')).toBe('2022-03')
    expect(fn(1646752738123, 'YYYY-MM S', '')).toBe('2022-03 123')
    expect(fn(1646752738123, 'YYYY-MM E qq季度', '')).toBe(
      '2022-03 周二 01季度'
    )
    expect(fn(1646752738123, 'YYYY-MM EE qq季度', '')).toBe(
      '2022-03 星期二 01季度'
    )
  })
  it('friendlyTime', function () {
    const fn = j.friendlyTime
    expect(fn()).toBe('刚刚')
    expect(fn(Math.floor(+Date.now() / 1000))).toBe('刚刚')
    expect(fn(+Date.now() - 61 * 1000)).toBe('1分钟前')
    expect(fn(+Date.now() - 121 * 1000)).toBe('2分钟前')
    expect(fn(+Date.now() - 61 * 60 * 1000)).toBe('1小时前')
    expect(fn(+Date.now() - 121 * 60 * 1000)).toBe('2小时前')
    expect(fn(+Date.now() - 24 * 60 * 60 * 1000)).toBe('昨天')
    expect(fn(+Date.now() - 2 * 24 * 60 * 60 * 1000)).toBe('2天前')
    expect(fn(+Date.now() - 7 * 24 * 60 * 60 * 1000)).toBe('1周前')
    expect(fn(+Date.now() - 35 * 24 * 60 * 60 * 1000)).toBe('2月前')
    expect(fn('', '', '--')).toBe('--')
    expect(fn(0, 'YYYY', '--')).toBe('1970')
  })
  it('px2vw', function () {
    const fn = j.px2vw
    expect(fn(375)).toBe('100vw')
    expect(fn(70, 375)).toBe('18.666667vw')
    expect(fn(70, 375, 2)).toBe('18.67vw')
    expect(fn(70, 375, 2, 'rem')).toBe('18.67rem')
  })

  it('secondToTime', function () {
    const fn = j.secondToTime
    expect(fn(1)).toBe('01秒')
    expect(fn(60)).toBe('01分00秒')
    expect(fn(70, 's')).toBe('70秒')
    expect(fn(70, 's', { unit: ['Y', 'M', 'd', 'h', 'm', 's'] })).toBe('70s')
    expect(fn(3600)).toBe('01时00分00秒')
    expect(fn(103600)).toBe('01天04时46分40秒')
    expect(fn(1103600)).toBe('12天18时33分20秒')
    expect(fn(11103600)).toBe('04月08天12时20分00秒')
    expect(fn(51103600)).toBe('01年07月21天11时26分40秒')
  })
  it('formatSize', function () {
    const fn = j.formatSize
    expect(fn(1)).toBe('1B')
    expect(fn(1100)).toBe('1.07K')
    expect(fn(1100, 3)).toBe('1.074K')
    expect(fn(1100, 3, 1)).toBe('1.074M')
    expect(fn(1100, 3, 1, 1000)).toBe('1.1M')
    expect(fn(1100, 3, 1, 1000, ['b', 'k', 'm', 'g', 't', 'p'])).toBe('1.1m')
    expect(fn(11111111110000000)).toBe('9.87P')
  })
  it('formatNumber', function () {
    const fn = j.formatNumber
    expect(fn(1)).toBe('1')
    expect(fn(1000)).toBe('1k')
    expect(fn(1900)).toBe('1.9k')
    expect(fn(10000)).toBe('1w')
    expect(fn(9000)).toBe('9k')
    expect(fn(10110)).toBe('1.01w')
  })
})