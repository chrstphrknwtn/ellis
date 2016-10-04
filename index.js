#!/usr/bin/env node

'use strict'

const now = Date.now()

const fs = require('fs')
const yargs = require('yargs')
const stats = require('./lib/stats')
const print = require('./lib/print')
const version = require('./package.json').version

/* Argv config
------------------------------------------------------------------------------*/
const argv = yargs.usage(
    'Usage: $0 [options] [glob|dir|file|file list]'
  )
  .example(
    '$0 *.js',
    'List files in current working directory matching the glob pattern \'*.js\'.'
  )
  .example(
    '$0 -p \'short-dates  filenames\'',
    'Specifies format for listing rows using named plugins, to produce:' +
    '27.09.16  package.json'
  )
  .option('p', {
    alias: 'plugins',
    describe: 'Listing row format of named plugins',
    type: 'string'
  })
  .option('t', {
    alias: 'timer',
    describe: 'Print execution time after listing',
    type: 'boolean'
  })
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .version(version)
  .argv

const args = argv._
const cmd = argv.$0

/* Register Plugins
------------------------------------------------------------------------------*/

let namedPlugins
const plugins = []

if (argv.plugins) {
  namedPlugins = argv.plugins.split(' ')
} else {
  namedPlugins = [
    'short-mode',
    'short-date-fading',
    'filename'
  ]
}

namedPlugins.forEach(plugin => {
  if (fs.statSync(`./plugins/ellis-${plugin}.js`)) {
    plugins.push(require(`./plugins/ellis-${plugin}`))
  }
})

/** Print Listing
------------------------------------------------------------------------------*/
print(stats(args, cmd), plugins)

/** Print timer
------------------------------------------------------------------------------*/
if (argv.t) {
  console.log(`\n\x1b[33m${Date.now() - now}ms\x1b[0m`)
}
