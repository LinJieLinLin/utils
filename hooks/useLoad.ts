import { AnyFn } from '@/types'
import { onLoad } from '@dcloudio/uni-app'
export function useLoad(initCb?: AnyFn) {
  let params: AnyObject = {}
  onLoad((data: AnyObject) => {
    Object.assign(params, data)
    if (initCb) initCb(data)
  })
  return params
}
