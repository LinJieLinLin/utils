const fs = require('fs')
const p = require('./package.json')
// 删除p内的scripts
delete p.scripts
delete p.exports
delete p.engines
delete p.engineStrict
p.main = './index.cjs'
p.module = './index.js'
p.types = './index.d.ts'
p.scripts = {}
p.devDependencies = {}
fs.writeFileSync('./build/package.json', JSON.stringify(p, null, 2))
