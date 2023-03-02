/**
 * @description resolver for unplugin-auto-import
 */
export const ljResolver = () => {
  let hooks: any = []
  return (name: string) => {
    if (!hooks.includes(name)) return
    return {
      name,
      from: 'lj-utils',
    }
  }
}
export default ljResolver
