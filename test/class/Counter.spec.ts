/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-13 09:29:53
 * @description: no
 */
import Counter from '../../src/class/Counter'
import { sleep } from '../../src/base'
describe('Debounce', () => {
  it('Counter', async function () {
    const cbFn = (count: number) => {
      return count
    }
    const count = new Counter(60, cbFn)
    count.start()
    expect(count.count).toBe(60)
    await sleep(1000)
    expect(count.count).toBe(59)
    count.stop()
    expect(count.count).toBe(59)
    count.start((count) => console.log(count))
    await sleep(1000)
    expect(count.count).toBe(58)
    count.stop()
  })
})
