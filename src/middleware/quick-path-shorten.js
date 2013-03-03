var debug = require('debug')('bigfile:quick-short-paths')

/**
 * Chop the fat of the local paths. This version will not 
 * work if you have any files which require files using their
 * absolute path 
 *
 * @param {Array} files
 * @param {Function} next
 * @return {Array}
 */

module.exports = function (files, next) {
	var nmreg = /^\/node_modules\//
	var paths = files.map(function (file) {
		return file.path
	}).filter(function (path) {
		return !nmreg.test(path)
	})

	var dir = commonDir(paths)
	debug('Excess path = %s', dir)

	// Nothing we can do
	if (dir === '/') next(files)

	var r = new RegExp('^'+dir)

	files.forEach(function (file) {
		file.path = file.path.replace(r, '')
	})

	if (typeof this.entry != 'string') {
		throw new Error('short-paths requires an `entry` property')
	}

	// Update the entry path 
	this.entry = this.entry.replace(r, '')

	next(files)
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
