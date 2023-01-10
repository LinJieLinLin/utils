import typescript from 'rollup-plugin-typescript'
import dts from 'rollup-plugin-dts'
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
    input: './index.ts',
    output: [
      {
        file: outputPath + '/index.js',
        format: 'es',
      },
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
  },
  {
    input: './microApi.ts',
    output: [
      {
        file: outputPath + '/microApi.js',
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        exclude: 'node_modules/**',
        typescript: require('typescript'),
      }),
    ],
    external: ['js-base64'],
  },
  {
    input: './class/index.ts',
    output: [
      {
        file: outputPath + '/class/index.js',
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        exclude: 'node_modules/**',
        typescript: require('typescript'),
      }),
    ],
    external: ['js-base64'],
  },
  {
    input: './types.ts',
    output: [
      {
        file: outputPath + '/types.js',
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        exclude: 'node_modules/**',
        typescript: require('typescript'),
      }),
    ],
  },
  // d.ts
  getDts('index'),
  getDts('microApi'),
  getDts('class/index'),
  getDts('types'),
]
