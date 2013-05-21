#!/usr/bin/env node

var program = require('commander')
  , Build = require('../src')
  , path = require('path')
  , all = require('when-all')
  , fs = require('fs')
  , debug = require('debug')('bigfile:cli')

require('colors')

program.version(require('../package').version)
  .usage('[options]')
  .option('-x, --export [name]', 'Set the global export')
  .option('-c, --compress', 'Minify the loader script of a development build')
  .option('-l, --leave-paths', 'Don\'t shorten paths in the production build')
  .option('-p, --plugins <plugins...>', 'A comma seperated list of plugins', list)
  .option('--mw <middleware...>', 'A comma seperated list of middleware', list)
  .option('-d, debug', 'bigfile takes any of node\'s debug options')
  // .option('-P, --production', 'Produce a highly optimised build')
  // .option('-g, --no-umd', 'Just export a global. Only available for production builds')

function list (args) {
  return args.split(',')
}

program.on('--help', function () {
  console.log('  Examples: ')
  console.log('  - Basic development build')
  console.log('    $ bigfile src/index.js'.grey)
  console.log('')
  console.log('  - Basic production build')
  console.log('    $ bigfile -P src/index.js'.grey)
  console.log('')
  console.log('  - With debugging enabled; this enables you to step through the build process')
  console.log('    $ bigfile src/index.js debug'.grey)
  console.log('')
})

program.command('list')
  .description('show available plugins and middleware')
  .action(function (cmd) {
    var list = fs.readdirSync(path.resolve(__dirname, '../src/plugins'))
    // Don't show the ones that are included by default
    list = list.filter(function (plugin) {
      switch (plugin) {
        case 'javascript':
        case 'json': return false
      }
      return true
    })
    console.log('')
    console.log('  Available plugins: \n%s', render(list))
    console.log('')
    var list = fs.readdirSync(path.resolve(__dirname, '../src/middleware'))
    console.log('  Available middleware: \n%s', render(list))
    console.log('')

    function removeExt (file) {
      return file.replace(/\.js$/, '')
    }
    function render (list) {
      return list.map(removeExt).sort().forEach(function(item){
        console.log(('  '+item).green)
      })
    }
    process.exit(0)
  })

program.parse(process.argv)

var files = program.args.map(function (file) {
  return path.resolve(file)
})

if (program.export == null) {
  program.export = path.basename(process.cwd()).replace(/[^\w]/, '')
  debug('Inferred build name from path: %s', program.export)
}
process.stderr.write('Module exporting as: '.blue)
process.stderr.write(program.export.blue.bold)
process.stderr.write('\n')

// stdin
var buf = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', function(chunk){ buf += chunk })
process.stdin.on('end', build)
process.stdin.resume()

function build(){
  try {
    var files = JSON.parse(buf)
  } catch (e) {
    e.message += ' (while parsing JSON from stdin)'
    throw e
  }
  var build = new Build(program.export, files)

  for (var i = 0, len = files.length; i < len; i++) {
    if (files[i].parents.length === 0) build.entry = files[i].path
  }
  if (!build.entry) throw new Error('Unable to determine an entry file')
  debug('Entry file determined as %s', build.entry)

  // Explicit middleware
  if (program.mw) {
    program.mw.forEach(function (middleware) {
      console.warn('install middleware: %s'.blue, middleware)
      build.use(middleware)
    })
  }
  // else if (program.production) {
  //   build.use(
  //     'filter',
  //     'transform',
  //     'production'
  //   )
  //   if (program.umd) {
  //     build.use('umd')
  //   } else {
  //     build.use('global')
  //   }
  //   build.use('compress')
  // } 
  else {
    build.use('transform')
    if (!program.leavePaths) build.use('quick-path-shorten')
    build.use('development')
    build.use('umd')
    if (program.compress) {
      // Will only compress the require implementation
      build.use('compress')
    }
  }

  program.plugins && program.plugins.forEach(function (plugin) {
    console.warn('install plugin: %s'.blue, plugin)
    build.plugin(plugin)
  })

  build.run(function (code) {
    process.stdout.write(code)
  })
}
