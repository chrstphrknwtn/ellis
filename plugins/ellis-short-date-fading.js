'use strict'

/* mtime short dates fading plugin
------------------------------------------------*/
module.exports = function rottingDatesPlugin(stats) {
  const now = Date.now()

  const column = []

  stats.forEach(file => {
    const fileAge = now - file.stat.mtime

    const colorMin = 55

    const ageRange = 86400000 * 10 // one day * 10
    const ageMultiplier = Math.max(0, (ageRange - fileAge) / ageRange)
    const ageAddon = ((255 - colorMin) * ageMultiplier) + colorMin
    let ageColor = parseInt(ageAddon, 10)

    const colorCode = `\x1b[38;2;${ageColor};${ageColor};${ageColor}m`

    // format date
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
