/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-13 09:29:53
 * @description: no
 */
import Throttle from '../../class/Throttle'
import { sleep } from '../../base'
describe('Throttle', () => {
  it('Throttle', async function () {
    const tr = new Throttle()
    let runCount = 0
    const fn = (...arg: any[]) => {
      runCount++
      return typeof arg
    }
    expect(tr.clickTime).toBe(0)
    tr.throttle(fn, 1000, 1, 2, 3)
    tr.throttle(fn, 1000, 1, 2, 3)
    tr.throttle(fn, 1000, 1, 2, 3)
    expect(tr.clickTime).toBe(2)
    expect(runCount).toBe(1)
    await sleep(1010)
    tr.throttle(fn, 1000, 1, 2, 3)
    tr.throttle(fn)
    expect(tr.clickTime).toBe(1)
    expect(runCount).toBe(2)
  })
})
