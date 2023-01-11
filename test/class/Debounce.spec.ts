/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-13 10:58:57
 * @description: no
 */
/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-13 10:38:37
 * @description: no
 */
/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-13 09:29:53
 * @description: no
 */
import Debounce from '../../src/class/Debounce'
import { sleep } from '../../src/base'
describe('Debounce', () => {
  it('Debounce', async function () {
    const db = new Debounce()
    let runCount = 0
    const fn = (...arg: any[]) => {
      runCount++
      return typeof arg
    }
    db.debounce(fn, 500, 1, 2)
    db.debounce(fn, 500, 1, 2)
    expect(runCount).toBe(0)
    await sleep(501)
    expect(runCount).toBe(1)

    db.debounce(fn, 500, 1, 2)
    db.debounce(fn, 500, 1, 2)
    db.debounce(fn, 500, 1, 2)
    await sleep(501)
    db.debounce(fn)
    await sleep(101)
    db.debounce(fn)
    await sleep(101)
    db.debounce(fn)
    await sleep(101)
    db.debounce(fn)
    await sleep(501)
    expect(runCount).toBe(3)
  })
})
