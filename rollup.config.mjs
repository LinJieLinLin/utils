import typescript from '@rollup/plugin-typescript'
import * as glob from 'glob'
const outputPath = './build'
const inputFiles = glob.sync('src/**/*.ts')

export default [
  {
    input: inputFiles,
    output: {
      dir: outputPath,
      format: 'esm',
      preserveModulesRoot: 'src',
      preserveModules: true,
    },
    plugins: [
      typescript({
        compilerOptions: {
          declaration: true,
          declarationDir: outputPath,
          outDir: outputPath,
        },
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: outputPath + '/index.umd.js',
        name: 'ljFn',
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
          outDir: outputPath,
        },
      }),
    ],
  },
  {
    input: './src/resolver.ts',
    output: [
      {
        file: outputPath + '/resolver.js',
        name: 'ljResolver',
        format: 'umd',
      },
    ],
    plugins: [
      typescript({
        compilerOptions: {
          outDir: outputPath,
        },
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: outputPath + '/es5/index.umd.js',
        name: 'ljFn',
        format: 'umd',
      },
      {
        file: outputPath + '/es5/index.cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        compilerOptions: {
          outDir: outputPath,
          module: 'es2015',
          target: 'es2015',
        },
      }),
    ],
  },
]
