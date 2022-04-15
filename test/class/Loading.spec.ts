/*
 * @author: linj
 * @email: 993353454@qq.com
 * @Date: 2022-04-13 09:29:53
 * @description: no
 */
import Loading from '../../class/Loading'
import { sleep } from '../../base'
describe('Loading', () => {
  it('Loading', async function () {
    let loadTime = 0
    const showFn = () => {
      loadTime++
    }
    const hideFn = () => {
      loadTime--
    }
    const L = new Loading(showFn, hideFn)
    L.loading(1)
    expect(L.loadNum).toBe(1)
    expect(loadTime).toBe(0)
    await sleep(500)
    expect(loadTime).toBe(1)
    L.loading()
    await sleep(1)
    expect(loadTime).toBe(0)
    expect(L.loadNum).toBe(0)

    L.loading(1)
    // await sleep(10)
    expect(loadTime).toBe(0)
    await sleep(500)
    expect(loadTime).toBe(1)
    L.loading()
    await sleep(1)
    expect(loadTime).toBe(0)
    expect(L.loadNum).toBe(0)

    L.loading(1)
    L.loading(1)
    L.loading(1)
    expect(L.loadNum).toBe(3)
    L.loading()
    L.loading()
    await sleep(2)
    expect(L.loadNum).toBe(1)
    await sleep(500)
    L.loading()
    await sleep(2)
    expect(L.loadNum).toBe(0)
  })
})
