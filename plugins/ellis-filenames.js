'use strict'

const fs = require('fs')
const path = require('path')

/* filename plugin
------------------------------------------------*/
module.exports = function filenamePlugin(stats) {
  const column = []

  // TODO: Parse LSCOLORS for color
  const colorCodes = {
    e: '\x1b[31m', // executable
    d: '\x1b[34m',
    f: '\x1b[37m',
    b: '\x1b[46;34m',
    c: '\x1b[43;34m',
    l: '\x1b[35m',
    p: '\x1b[33m',
    s: '\x1b[32m'
  }
  const colorReset = '\x1b[0m'

  stats.forEach(file => {
    if (file.isDirectory) {
      column.push(`${colorCodes.d}${file.name}`)
    } else if (file.isCharacterDevice) {
      column.push(`${colorCodes.c}${file.name}`)
    } else if (file.isBlockDevice) {
      column.push(`${colorCodes.b}${file.name}`)
    } else if (file.isFIFO) {
      column.push(`${colorCodes.p}${file.name}`)
    } else if (file.isSocket) {
      column.push(`${colorCodes.s}${file.name}`)
    } else if (file.isSymbolicLink) {
      let realpath
      try {
        let symlinkTarget = fs.realpathSync(file.name)
        realpath = path.relative(process.cwd(), symlinkTarget)
      } catch (err) {
        realpath = '[broken symbolic link]'
      }
      column.push(`${colorCodes.l}${file.name}${colorReset} → ${realpath}`)
    } else if (file.isExecutable) {
      column.push(`${colorCodes.e}${file.name}`)
    } else {
      column.push(`${file.name}`)
    }
  })

  return column
}
