var stylus = require('stylus')
var Result = require('result')

exports.handlers = [ TransformStylus ]

function TransformStylus(file, options) {
  var result = new Result
  stylus(file.text)
    .set('filename', file.path)
    .render(function(err, css){
      if (err) result.error(err)
      else {
        file.text = 'require(\'/node_modules/css-install.js\')('+JSON.stringify(css)+')'
        result.write(file)
      }
    })
  return result
}

TransformStylus.test = function(file){
  if (/\.styl$/.test(file.path)) return 1
}

exports.dependencies = [
  {
    path: '/node_modules/css-install.js',
    text: [
      'module.exports = function (text) {',
      ' var style = document.createElement(\'style\')',
      ' style.appendChild(document.createTextNode(text))',
      ' document.getElementsByTagName(\'head\')[0].appendChild(style)',
      '}'
    ].join('\n')
  }
]
