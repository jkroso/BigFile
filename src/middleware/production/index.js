var falafel = require('falafel')
  , minify = require('../../utils').minify
  , read = require('fs').readFileSync

/*!
 * Load the require implementation
 */
var requireCode = read(__dirname+'/require.js', 'utf-8')

/**
 * Create a runnable script from an array of files.
 * Each file will have its `require('./path')` calls replaced
 * with `require(index)` calls. A require implementation will also 
 * be appended to the source code when it joined together
 * 
 * @param {Array} files
 * @param {Function} next
 * @return {String} with a require implementation
 */

module.exports = function (files, next) {
	var self = this
	var dict = {}
	  , entry

	files.forEach(function (file, i) {
		file.index = i
		file.text = simpleCompress(file.text)
		dict[file.path] = file
	})

	if (this._entry == null) 
		throw new Error('Production build needs an ._entry defined')

	// Set the entry to its index instead of its path
	this._entry = dict[this._entry].index

	// Replace paths with index's
	files = files.map(function (file) {
		return falafel(file.text, function (node) {
			if (isRequire(node)) {
				var name = node.arguments[0].value
				var path = self.graph.resolveInternal(file.base, name)
				
				if (!path) throw new Error(name+' is not in the soucegraph')
				if (!dict[path]) throw new Error(name+' should not of resolved to '+path)
				
				node.update('require('+dict[path].index+')')
			}
		}).toString()
	})

	var code = [
		requireCode,
		'var modules = ' + JSON.stringify(files),
	].join('\n')

	next(minify(code, {
		compress: true,
		beautify: false,
		leaveAst: false
	}))

	/*!
	 * Test if an AST node is a call to "require"
	 */
	function isRequire (node) {
		return node.type === 'CallExpression'
			&& (node = node.callee).type === 'Identifier'
			&& node.name === 'require'
	}
}

/**
 * This mostly just gets rid of whitespace.
 *
 * @param {String} src
 * @return {String}
 */
function simpleCompress (src) {
	return minify(src, {
		compress: true,
		beautify: false,
		// I don't like what uglify does with the ast from 
		// a runtime performance perspective. Perhaps I
		// should disable it ast tricks. For now I'll trust 
		// uglify knows what it is doing
		leaveAst: false
	})
}

/**
 * Minify the module code. I'm not currently using this function since
 * name gzip does a better job with long names than it does with short
 * making name mangling a net negative in some cases. If your not using 
 * gzip though this function will save you some bytes
 * 
 * @param {String} src
 * @return {String}
 */

function compressModule (src) {
	// has to have a side effect otherwise uglify is so damn smart it'll go
	// hey this code doesn't even expose anything useful and just return an 
	// empty string. In this case the side effect is that it generates a 
	// global variable `a`. The reason I am using a function wrapper is to
	// prevent uglify treating all variables used within the function as global
	// and therefore not shortening their name. Perhaps there is a better way
	var fn = 'function a(module,exports,require){'+src+'}'
	fn = minify(fn, {
		compress: true,
		beautify: false,
		leaveAst: false
	})
	fn.replace(extractCode, function (_, module, exports, require, code) {
		// I should be adjusting the internal
		return code
	})
}

var extractCode = /^function a\((\w+),(\w+),(\w+)\)\{(.*)\}$/