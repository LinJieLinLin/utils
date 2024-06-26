/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-13 09:29:53
 * @description: no
 */
import Throttle from '../../src/class/Throttle'
import { sleep } from '../../src/base'
describe('Throttle', () => {
  it('Throttle', async function () {
    const tr = new Throttle()
    let runCount = 0
    const fn = (...arg: any[]) => {
      runCount++
      return typeof arg
    }
    tr.throttle(fn, 1000, 1, 2, 3)
    tr.throttle(fn, 1000, 1, 2, 3)
    tr.throttle(fn, 1000, 1, 2, 3)
    expect(runCount).toBe(1)
    await sleep(1010)
    tr.throttle(fn, 1000, 1, 2, 3)
    tr.throttle(fn)
    expect(runCount).toBe(2)
    await sleep(1010)
    tr.throttle(fn, 1000, 1, 2, 3)
    expect(runCount).toBe(3)
  })
})
