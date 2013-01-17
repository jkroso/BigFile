var read = require('fs').readFileSync

/*!
 * Load the require implementation
 */
var requireCode = read(__dirname+'/require.js', 'utf-8')

/*!
 * match the start of a function declaration
 */ 
var fre = /^function\s*/

/**
 * Compile the code needed to resolve a component module
 *
 * @return {String}
 * @api private
 */

function componentsCode () {
	var component = require('sourcegraph/src/plugins/component')
	var codes = [
		component.hashSystem.toString().replace(fre, 'function components '),
		component.variants.toString()
	]
	return codes.map(function (code) {
		return code.replace(/variants/, 'componentVariants')
	}).join('\n')
}

/**
 * Compile the code needed to resolve a component module
 * 
 * @return {String}
 * @api private
 */

function nodeModulesCode () {
	var node = require('sourcegraph/src/plugins/nodeish')
	var codes = [
		node.hashSystem.toString().replace(fre, 'function node_modules '),
		node.variants.toString()
	].map(function (code) {
		return code.replace(/variants/, 'nodeishVariants')
	}).join('\n')
	return codes
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
		componentsCode(),
		'modules = ' + JSON.stringify(dict),
		'checks = [node_modules, components]'
	].join('\n')

	next(code)
}