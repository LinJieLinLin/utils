const lj = require('./build/index.cjs')
const fs = require('fs')
const nameList = Object.keys(lj)
const file = fs.readFileSync('./build/resolver.js', 'utf-8', (err, data) => {
  return data
})
const reg = /(const fnList\s*=\s*)(\[[\s\S]*?\])/
const res = file.replace(reg, '$1' + JSON.stringify(nameList))
fs.writeFile('./build/resolver.js', res, { encoding: 'utf-8' }, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('resolver.js has been saved')
})
