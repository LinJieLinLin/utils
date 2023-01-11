// import typescript from 'rollup-plugin-typescript'
// import dts from 'rollup-plugin-dts'
const typescript = require('rollup-plugin-typescript')
const dts = require('rollup-plugin-dts')

// import { terser } from 'rollup-plugin-terser'
const outputPath = './build'
const getDts = (name) => {
  return {
    input: `./${name}.ts`,
    output: [
      {
        file: `${outputPath}/${name}.d.ts`,
        format: 'es',
      },
    ],
    plugins: [dts()],
  }
}
export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: outputPath + '/index.cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        exclude: 'node_modules/**',
        typescript: require('typescript'),
      }),
      // 压缩
      // terser(),
    ],
    // sourcemap: true,
  },
  // d.ts
  // getDts('index'),
]
