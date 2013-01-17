var falafel = require('falafel')
  , debug = require('debug')('bigfile:short-paths')

/**
 * Chop the fat of the local paths.
 * 
 * Local paths end up being way longer than neccesary for 
 * informational purposes since we can easily assume some base
 * such as the project directory. Whats important is their paths 
 * relative to one another. 
 *
 * @param {Array} files
 * @param {Function} next
 * @return {Array}
 */

module.exports = function (files, next) {
	var paths = files.map(function (file) {
		return file.path
	})
	var dir = commonDir(paths)
	debug('Excess path = %s', dir)
	// Nothing we can do
	if (dir === '/') next(files)

	var r = new RegExp('^'+dir)

	// Replace paths with index's
	files = files.map(function (file) {
		file.text = falafel(file.text, function (node) {
			if (isRequire(node)) {
				var path = node.arguments[0].value
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

	// Update the entry path 
	this._entry = this._entry.replace(r, '')

	next(files)

	/*!
	 * Test if an AST node is a call to "require"
	 */
	function isRequire (node) {
		return node.type === 'CallExpression'
			&& (node = node.callee).type === 'Identifier'
			&& node.name === 'require'
	}
}

function dirname (path){
  return path.split('/').slice(0, -1).join('/') || '.'; 
}

/**
 * Split a path into its components
 *
 * @param {String} path 
 * @return {Array}
 */

function split (path) {
  if (path[0] === '/') path = path.slice(1)
  if (path[path.length - 1] === '/') path = path.slice(0, -1)
  return path.split('/')
}

/**
 * Find the lowest common ancestor between several absolute paths
 *
 * @param {String} paths... pass as many as you like
 * @return {String}
 */

function commonDir (first) {
  if (first instanceof Array) return commonDir.apply(null, first)
  if (!first) return '/'
  first = dirname(first)
  if (first === '.') return '/'
  first = split(first)

  for (var i = 1, len = arguments.length; i < len; i++) {
    first = compare(first, split(arguments[i]))
  }

  return '/' + first.join('/')
}

/**
 * Find the closest common ancestor between two paths
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 * @api private
 */

function compare (a, b) {
  for (var i = 0, len = a.length; i < len; i++) {
    if (a[i] !== b[i]) {
      return a.slice(0, i)
    }
  }
  return a
}