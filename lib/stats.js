'use strict'

const fs = require('fs')

module.exports = function (args, cmd) {
  const files = parseFileArgs(args, cmd)
  const stats = []

  files.forEach(file => {
    let fileStat = stat(file, cmd)
    stats.push(fileStat)
  })

  return stats
}

/* Parse args and return array of files
------------------------------------------------------------------------------*/
function parseFileArgs(args, cmd) {
  let files

  /* TODO: stdin args
  ----------------------------------------------*/

  /* cli args
  ----------------------------------------------*/
  // No args, list CWD
  if (args.length === 0) {
    files = addDots(fs.readdirSync(process.cwd()))

  // Single arg: dir or file?
  } else if (args.length === 1) {
    let file = args[0]
    let stat = tryStat(file, cmd)

    if (stat.isDirectory()) {
      files = addDots(fs.readdirSync(file))
      // TODO: somehow fix this side effect
      process.chdir(file)
    } else {
      files = [file]
    }

  // Multiple args, assume they are a list of files
  } else if (args.length >= 2) {
    files = args
  }

  return files
}

/* Try to stat a file or dir and return Stat object, exit if not found
------------------------------------------------------------------------------*/
function tryStat(file, cmd) {
  let stat

  try {
    stat = fs.lstatSync(file)
  } catch (err) {
    process.stdout.write(`${cmd}: ${file}: No such file or directory`)
    process.exit(1)
  }

  return stat
}

/* Stat a file and return extended Stat
------------------------------------------------------------------------------*/
function stat(file, cmd) {
  const fileStat = {}
  let stat = tryStat(file, cmd)

  fileStat.stat = stat
  fileStat.name = file

  // TODO: executable filemodes
  fileStat.isExecutable = (fileStat.stat.mode & 64)

  fileStat.isFile = fileStat.stat.isFile()
  fileStat.isDirectory = fileStat.stat.isDirectory()
  fileStat.isBlockDevice = fileStat.stat.isBlockDevice()
  fileStat.isCharacterDevice = fileStat.stat.isCharacterDevice()
  fileStat.isSymbolicLink = fileStat.stat.isSymbolicLink()
  fileStat.isFIFO = fileStat.stat.isFIFO()
  fileStat.isSocket = fileStat.stat.isSocket()

  return fileStat
}

/* add . ..  to dir listings
------------------------------------------------------------------------------*/
function addDots(files) {
  let filesWithDots = files.slice()
  let dots = ['..', '.']

  dots.forEach(dir => {
    filesWithDots.unshift(dir)
  })

  return filesWithDots
}
