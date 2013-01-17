/**
 * Require the given path.
 *
 * @param {String} path   Full path to the required file
 * @param {String} parent The file which this call originated from
 * @return {Object} module.exports
 */

function require (path, parent){
	// Determine the correct path
	var fullpath = resolve(parent, path)
	  , module = modules[fullpath]

	if (module == null) throw new Error('failed to require "'+path+'" from '+parent)

	// It hasn't been loaded before
	if (typeof module === 'string') {
		var code = module
		module = {
			src: code,
			exports: {}
		}
		modules[fullpath] = module
		Function(
			'module',
			'exports',
			'require',
			// Eval prevents the function wrapper being visible
			// The source allows the browser to present this module as if it was a normal file
			"eval("+JSON.stringify(code+'\n//@ sourceURL='+encodeURI(fullpath))+")"
			// module
		).call(module.exports, module, module.exports,
			// Relative require function
			function (rp) {
				return require('.' === rp[0] ? join(dirname(fullpath), rp) : rp, fullpath)
			}
		)
	}
	return module.exports
}

/**
 * Figure out what the full path to the module is
 *
 * @param {String} base, the current directory
 * @param {String} path, what was inside the call to require
 * @return {String}
 * @api private
 */

function resolve (base, path) {
	if (path.match(/^\/|(?:[a-zA-Z]+:)/)) {
		return modules[path] && path
			|| modules[path+'.js'] && path+'.js'
			|| modules[path+'.json'] && path+'.json'
			|| modules[path+'index.js'] && path+'index.js'
			|| modules[path+'/index.js'] && path+'/index.js'
	}
	else {
		while (true) {
			for ( var i = 0, len = checks.length; i < len; i++ ) {
				var res = checks[i](base, path, modules)
				if (res != null) return res
			}
			if (base === '/') break
			base = dirname(base)
		}
	}
}

function dirname (path) {
	if (path[path.length - 1] === '/') path = path.slice(0, -1)
	return path.split('/').slice(0,-1).join('/') || '/'
}

function normalize (path) {
	var isAbsolute = path[0] === '/'
	  , res = []
	path = path.split('/')

	for (var i = 0, len = path.length; i < len; i++) {
		var seg = path[i]
		if (seg === '..') res.pop()
		else if (seg && seg !== '.') res.push(seg)
	}

	return (isAbsolute ? '/' : '') + res.join('/')
}

function join () {
	return normalize(slice(arguments).filter(function(p) {
		return p
	}).join('/'))
}

function slice (args) {
	return Array.prototype.slice.call(args)
}
