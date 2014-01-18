
var debug = require('debug')('bigfile:short-paths')
var commonDir = require('path/common')
var falafel = require('falafel')

/**
 * Chop the fat of the local paths.
 * 
 * Local paths end up being way longer than neccesary for 
 * informational purposes since we can easily assume some base
 * such as the project directory. Whats important is their paths 
 * relative to one another. 
 *
 * @param {Array} files
 * @return {Array}
 */

module.exports = function(files){
  var nmreg = /^\/node_modules\//
  var paths = files.map(function(file){
    return file.path
  }).filter(function (path) {
    return !nmreg.test(path)
  })
  var dir = commonDir(paths)
  debug('Excess path = %s', dir)
  // Nothing we can do
  if (dir === '/') return files

  var r = new RegExp('^'+dir)

  // Replace paths with index's
  files = files.map(function (file) {
    file.text = falafel(file.text, function (node) {
      if (isRequire(node)) {
        var path = node.arguments[0].value

        if (path == null) {
          debug(
            'Dynamic require detected: %s at %s#%d',
            node.source(),
            file.path,
            file.text.slice(0, node.range[0]).split('\n').length
          )
          return
        }
        // only need to alter absolute paths
        if (path[0] !== '/') return
        path = path.replace(r, '')
        node.update('require('+JSON.stringify(path)+')')
      }
    }).toString()
    // chop path
    file.path = file.path.replace(r, '')
    return file
  })

  if (typeof this.entry != 'string') {
    throw new Error('short-paths requires an `entry` property')
  }
  // Update the entry path 
  this.entry = this.entry.replace(r, '')

  return files

}

/**
 * Test if an AST node is a call to "require"
 */

function isRequire (node) {
  return node.type === 'CallExpression'
    && (node = node.callee).type === 'Identifier'
    && node.name === 'require'
}