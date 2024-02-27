import { build } from 'esbuild'
import * as glob from 'glob'
const outputPath = './build'
// 使用 glob 模块来展开 glob 通配符
const entryPoints = glob.sync('src/**/*.ts')
build({
  entryPoints,
  bundle: false,
  outdir: outputPath,
  legalComments: 'inline',
  tsconfig: 'tsconfig.json',
}).catch(() => process.exit(1))
