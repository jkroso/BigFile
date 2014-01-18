
var jade = require('jade')
var read = require('fs').readFileSync

exports.handlers = [ transform ]

function transform(file, options){
  var requires = []
  var text = file.text.replace(/^require\s*(.+)/mg, function (_, req) {
    requires.push(req)
    return ''
  })

  var fn = jade.compileClient(text, {
      compileDebug: options && options.debug,
      filename: file.path,
      pretty: false
    }).toString()

  file.text = [
    'var jade = require(\'/node_modules/jade-runtime.js\')',
    'module.exports = ' + fn
  ].concat(requires.map(function (req) {
    return 'require(\'' + req.trim() + '\')'
  })).join('\n')

  return file
}

transform.test = function(file){
  return (/\.jade$/).test(file.path)
    ? 1
    : 0
}

exports.dependencies = [
  {
    path: '/node_modules/jade-runtime.js',
    text: read(require.resolve('jade/lib/runtime'), 'utf-8')
  }
]
