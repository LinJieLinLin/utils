const lj = require('./build/index.cjs')
const fs = require('fs')
const nameList = []
for (let k in lj) {
  nameList.push(k)
}
fs.writeFile(
  './build/meta-data.js',
  'export default ' + JSON.stringify(nameList),
  (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('meta-data.js has been saved')
  }
)
