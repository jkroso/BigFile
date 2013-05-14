
var read = require('fs').readFileSync

/*!
 * Load run time source
 */

var requireCode = read(__dirname+'/require.js', 'utf-8')
var hydrationCode = read(__dirname+'/hydrate.js', 'utf-8')


/**
 * Wrap a mapping of modules with the environment required to run them
 *
 * @param {Object} dict, maps paths to content
 * @param {Function} next
 * @return {String}
 */

module.exports = function (files, next) {
	debugger;
	var code = [
		'var modules = ' + json(mapFiles(files)),
		'var aliases = ' + json(mapAliases(files)),
		hydrationCode,
		requireCode,
	].join('\n')

	next(code)
}

function json(obj){
	return JSON.stringify(obj, null, 2)
}

/**
 * map real path to their text
 * 
 * @param {Array} files
 * @return {Object}
 */

function mapFiles(files){
	return files.reduce(function(map, file){
		map[file.path] = file.text
		return map
	}, {})
}

/**
 * map aliases to their real paths
 * 
 * @param {Array} files
 * @return {Object}
 */

function mapAliases(files){
	return files.reduce(function(map, file){
		if (!('aliases' in file)) return map
		return file.aliases.reduce(function(map, alias){
			map[alias] = file.path
			return map
		}, map)
	}, {})
}
