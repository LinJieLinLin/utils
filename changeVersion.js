// 修改package.json中的版本号信息
// import shell from 'child_process'
// import info from './package.json' assert { type: 'json' }
const shell = require('child_process')
const info = require('./package.json')

function writePackageJson(newVersion) {
  shell.exec('cd build && npm version ' + newVersion)
  console.log('version修改为：', newVersion)
}
writePackageJson(info.version)
