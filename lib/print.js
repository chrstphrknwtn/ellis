'use strict'

module.exports = function (files, plugins) {
  const columns = []
  const colorReset = '\x1b[0m'

  plugins.forEach(plugin => {
    columns.push(plugin(files))
  })

  process.stdout.write(`\n`)
  for (let i = 0; i < files.length; i++) {
    for (let j = 0; j < columns.length; j++) {
      process.stdout.write(`${colorReset}${columns[j][i]}${colorReset}  `)
    }
    process.stdout.write(`\n`)
  }
}
