import typescript from '@rollup/plugin-typescript'

// import { terser } from 'rollup-plugin-terser'
const outputPath = './build'

export default [
  {
    input: './src/index.ts',
    output: [
      // {
      //   file: outputPath + '/index.js',
      //   format: 'esm',
      // },
      {
        file: outputPath + '/index.umd.js',
        name: 'f',
        format: 'umd',
      },
      {
        file: outputPath + '/index.cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        compilerOptions: {
          declarationDir: '',
        },
      }),
    ],
  },
]
