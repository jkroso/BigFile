
var debug = require('debug')('bigfile:quick-short-paths')
var commonDir = require('path/common')

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
	// extract paths
	var paths = files.reduce(function(paths, file){
		paths.push(file.path)
		if (file.aliases) return paths.concat(file.aliases)
		return paths
	}, []).filter(function (path) {
		return !nmreg.test(path)
	})

	var dir = commonDir(paths)
	debug('excess path = %s', dir)

	// Nothing we can do
	if (dir === '/') next(files)
	
	// apply the chop
	dir = new RegExp('^'+dir)
	files.forEach(function (file) {
		file.path = file.path.replace(dir, '')
		var aliases = file.aliases
		if (aliases && aliases.length) {
			file.aliases = aliases.map(function(path){
				return path.replace(dir, '')
			})
		}
	})

	if (typeof this.entry != 'string') {
		throw new Error('short-paths requires an `entry` property')
	}

	// Update the entry path 
	this.entry = this.entry.replace(dir, '')

	next(files)
}
