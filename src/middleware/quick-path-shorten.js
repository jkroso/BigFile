
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
	// treat packin packages as top level node_modules
	chop(files, new RegExp('^'+process.env.HOME+'/.packin/-'), '/node_modules')

	// extract paths
	var paths = files
		.reduce(function(paths, file){
			paths.push(file.path)
			if (file.aliases) return paths.concat(file.aliases)
			return paths
		}, [])
		// ignore top level deps
		.filter(function (path) {
			return !(/^\/node_modules\//).test(path)
		})

	var dir = commonDir(paths)
	debug('excess path = %s', dir)

	// Nothing we can do
	if (dir === '/') return next(files)
	
	dir = new RegExp('^'+dir)
	chop(files, dir)

	if (typeof this.entry != 'string') {
		throw new Error('short-paths requires an `entry` property')
	}

	// Update the entry path 
	this.entry = this.entry.replace(dir, '')

	next(files)
}

/**
 * apply a chop to all files
 * 
 * @param {Array} files
 * @param {RegExp} regex
 * @param {String} [add='']
 */

function chop(files, regex, add){
	add || (add = '')
	files.forEach(function (file) {
		file.path = file.path.replace(regex, add)
		var aliases = file.aliases
		if (aliases && aliases.length) {
			file.aliases = aliases.map(function(path){
				return path.replace(regex, add)
			})
		}
	})
}
