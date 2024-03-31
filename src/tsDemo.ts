// Partial<T> - 将类型 T 的所有属性设置为可选。
type PartialDemo = Partial<{ name: string; age: number }>

// Required<T> - 将类型 T 的所有属性设置为必需的。
type RequiredDemo = Required<{ name?: string; age?: number }>

// Readonly<T> - 将类型 T 的所有属性设置为只读。
type ReadonlyDemo = Readonly<{ name: string; age: number }>

// Record<K, T> - 创建一个对象类型，其属性键为 K，值为 T。
type RecordDemo = Record<string, number>

// Pick<T, K> - 从类型 T 中选择属性 K。
type PickDemo = Pick<{ name: string; age: number }, 'name'>

// Omit<T, K> - 从类型 T 中排除属性 K。
type OmitDemo = Omit<{ name: string; age: number }, 'name'>

// Exclude<T, U> - 从 T 中排除可赋值给 U 的类型。
type ExcludeDemo = Exclude<string | number, number>

// Extract<T, U> - 从 T 中提取可赋值给 U 的类型。
type ExtractDemo = Extract<string | number, string>

// NonNullable<T> - 从 T 中排除 null 和 undefined。
type NonNullableDemo = NonNullable<string | null | undefined>

// Parameters<T> - 获取函数类型 T 的参数类型。
type ParametersDemo = Parameters<(x: number, y: number) => void>
declare function f1(arg: { a: number; b: string }): void
type T0 = Parameters<() => string>
// type T0 = []
type T1 = Parameters<(s: string) => void>
// type T1 = [s: string]
type T2 = Parameters<<T>(arg: T) => T>
// type T2 = [arg: unknown]
type T3 = Parameters<typeof f1>
// type T3 = [
//   arg: {
//     a: number
//     b: string
//   }
// ]
type T4 = Parameters<any>
// type T4 = unknown[]
type T5 = Parameters<never>
// type T5 = never

// ConstructorParameters<T> - 获取构造函数类型 T 的参数类型。
type ConstructorParametersDemo = ConstructorParameters<ErrorConstructor>
class C {
  constructor(a: number, b: string) {}
}
type T6 = ConstructorParameters<typeof C>
// type T6 = [a: number, b: string]

// ReturnType<T> - 获取函数类型 T 的返回类型。
type ReturnTypeDemo = ReturnType<() => string>

// InstanceType<T> - 获取构造函数类型 T 的实例类型。
class ExampleClass {}
type InstanceTypeDemo = InstanceType<typeof ExampleClass>
class C1 {
  x = 0
  y = 0
}
type T7 = InstanceType<typeof C1>
// type T7 = C1

// ThisParameterType<T> - 获取函数类型 T 的 this 参数类型。
function toHex(this: Number) {
  return this.toString(16)
}
function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n)
}

// OmitThisParameter<T> - 从函数类型 T 中排除 this 参数。
function toHex1(this: Number) {
  return this.toString(16)
}
// const fiveToHex: OmitThisParameter<typeof toHex1> = toHex1.bind(5)

// ThisType<T> - 获取函数类型 T 的 this 类型。此实用程序不返回转换后的类型。相反，它充当上下文 this 类型的标记。请注意，必须启用 noImplicitThis 标志才能使用此实用程序。
declare function f2(this: { a: string }): void
type T8 = ThisType<typeof f2>
// type T8 = { a: string }

// Uppercase<T> - 将字符串转换为大写。
type UppercaseDemo = Uppercase<string>
type T9 = Uppercase<'hello'>
// type T9 = 'HELLO'

// Lowercase<T> - 将字符串转换为小写。
type LowercaseDemo = Lowercase<string>
type T10 = Lowercase<'HELLO'>
// type T10 = 'hello'

// Capitalize<T> - 将字符串的第一个字母转换为大写。
type CapitalizeDemo = Capitalize<string>
type T11 = Capitalize<'hello'>
// type T11 = 'Hello'

// Uncapitalize<T> - 将字符串的第一个字母转换为小写。
type UncapitalizeDemo = Uncapitalize<string>
type T12 = Uncapitalize<'Hello'>
// type T12 = 'hello'

export default {}
