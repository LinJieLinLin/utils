/**
 * @description resolver for unplugin-auto-import
 */
import nameList from './meta-data.js'
export const ljResolver = () => {
  let hooks = nameList
  return (name) => {
    if (!hooks) return
    if (!hooks.includes(name)) return
    return {
      name,
      from: 'lj-utils',
    }
  }
}
export default ljResolver
