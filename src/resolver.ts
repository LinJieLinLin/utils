/**
 * @description resolver for unplugin-auto-import
 */
const fnList = ['']
export const ljResolver = () => {
  const hooks: any[] = fnList
  return (name: string) => {
    if (!hooks.includes(name)) return
    return {
      name,
      from: 'lj-utils',
    }
  }
}
