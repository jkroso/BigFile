var read = require('fs').readFileSync

/*!
 * Load the require implementation
 */
var requireCode = read(__dirname+'/require.js', 'utf-8')

/**
 * Compile the code needed to resolve a component module
 * 
 * @return {String}
 * @api private
 */

function nodeModulesCode () {
	var node = require('sourcegraph/src/plugins/nodeish')
	return [
		node.hashSystem.toString()
			.replace(/^function\s*/, 'function node_modules '),
		node.variants.toString()
	].join('\n')
}

/**
 * Wrap a mapping of modules with the environment required to run them
 *
 * @param {Object} dict, maps paths to content
 * @param {Function} next
 * @return {String}
 */

module.exports = function (dict, next) {
	var code = [
		requireCode,
		nodeModulesCode(),
		'var modules = ' + JSON.stringify(dict, null, '\t'),
	].join('\n')

	next(code)
}
