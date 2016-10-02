'use strict'

const fs = require('fs')
const path = require('path')

module.exports = function(argv) {
  const files = parseFileArgs(argv)
  const stats = [];

  files.forEach((file) => {
    let fileStat = stat(file, argv)
    stats.push(fileStat)
  })

  return stats
}


/* Parse args and return array of files
------------------------------------------------------------------------------*/
function parseFileArgs(argv) {
  let files

  /* TODO: stdin args
  ----------------------------------------------*/

  /* cli args
  ----------------------------------------------*/
  // No args, list CWD
  if (argv._.length === 0) {
    files = addDots(fs.readdirSync(process.cwd()))

  // Single arg: dir or file?
  } else if (argv._.length === 1) {
    let arg = argv._[0]

    let stat = tryStat(arg, argv.$0)

    if (stat.isDirectory()) {
      files = addDots(fs.readdirSync(arg))
      // TODO: somehow fix this side effect
      process.chdir(arg);
    } else {
      files = [arg]
    }

  // Multiple args, assume they are a list of files
  } else if (argv._.length >= 2) {
    files = argv._
  }

  return files
}


/* Try to stat a file or dir and return Stat object, exit if not found
------------------------------------------------------------------------------*/
function tryStat(arg, cmd) {
  let stat

  try {
    stat = fs.lstatSync(arg)
  } catch (err) {
    process.stdout.write(`${cmd}: ${arg}: No such file or directory`)
    process.exit(1)
  }

  return stat
}


/* Stat a file and return extended Stat
------------------------------------------------------------------------------*/
function stat(file, argv) {
  const fileStat = {}
  let stat = tryStat(file, argv.$0)

  fileStat.stat = stat
  fileStat.name = file

  // TODO: executable filemodes
  fileStat.isExecutable      = (fileStat.stat.mode & 64)

  fileStat.isFile            = fileStat.stat.isFile()
  fileStat.isDirectory       = fileStat.stat.isDirectory()
  fileStat.isBlockDevice     = fileStat.stat.isBlockDevice()
  fileStat.isCharacterDevice = fileStat.stat.isCharacterDevice()
  fileStat.isSymbolicLink    = fileStat.stat.isSymbolicLink()
  fileStat.isFIFO            = fileStat.stat.isFIFO()
  fileStat.isSocket          = fileStat.stat.isSocket()

  return fileStat
}


/* add . ..  to dir listings
------------------------------------------------------------------------------*/
function addDots(files) {
  let filesWithDots = files.slice()
  let dots = ['..', '.']

  dots.forEach((dir) => {
    filesWithDots.unshift(dir)
  })

  return filesWithDots
}
