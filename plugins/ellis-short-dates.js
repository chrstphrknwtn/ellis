'use strict'

/* mtime short date plugin
------------------------------------------------*/
module.exports = function shortDatePlugin(stats) {
  const column = []

  const colorCode = '\x1b[38;5;236m'

  stats.forEach(file => {
    const mtime = new Date(file.stat.mtime)

    const mdate = {
      d: mtime.getDate(),
      m: mtime.getMonth() + 1,
      y: mtime.getYear().toString().slice(-2)
    }

    if (mdate.d < 10) {
      mdate.d = '0' + mdate.d
    }
    if (mdate.m < 10) {
      mdate.m = '0' + mdate.m
    }

    column.push(`${colorCode}${mdate.d}.${mdate.m}.${mdate.y}`)
  })

  return column
}
