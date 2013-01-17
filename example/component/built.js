!function (context, definition) {
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    module.exports = definition()
  } else if (typeof define === 'function' && typeof define.amd  === 'object') {
    define(definition)
  } else {
    context[""] = definition()
  }
}(this, function () {
var modules = {}
  , checks = []

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
		do {
			for ( var i = 0, len = checks.length; i < len; i++ ) {
				var res = checks[i](base, path, modules)
				if (res != null) return res
			}
			base = dirname(base)
		} while (base !== '/') 
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
	return normalize(slice(arguments).filter(function(p, index) {
		return p
	}).join('/'))
}

function slice (args) {
	return Array.prototype.slice.call(args)
}

function node_modules (dir, name, hash) {
	var match = nodeishVariants(dir, name).filter(function (p) {
		return !!hash[p]
	})[0]

	if (match) return match

	if (dir === '/' && hash[base+name+'.js'])
		// Note: we always add ".js" at the end since node won't interpret those as core modules
		return base+name+'.js'
}
function nodeishVariants(dir, path) {
	// Is it a full path already
	if (path.match(/\.js(?:on)?$/)) {
		path = [path]
	}
	// A directory
	else if (path.match(/\/$/)) {
		path = [
			path+'index.js',
			path+'index.json',
			path+'package.json'
		]
	}
	// could be a directory or a file
	else {
		path = [
			path+'.js',
			path+'.json',
			path+'/index.js',
			path+'/index.json',
			path+'/package.json'
		]
	}

	return path.map(function (name) {
		return join(dir, 'node_modules', name)
	})
}
var base = "/home/jkroso/Dev/Libraries/SourceGraph/src/plugins/nodeish/modules/"
function components (dir, name, hash) {
	return componentVariants(dir, name).filter(function (p) {
		return !!hash[p]
	})[0]
}
function componentVariants(dir, path) {
	return [
		// Check for an alias...
		path,
		// ...and a real component
		path+'/component.json'
	].map(function (name) {
		return join(dir, 'components', name)
	})
}
modules = {"/home/jkroso/Dev/Libraries/Big File/example/component/rack/component.json":"module.exports = {\n\t\"name\": \"racks\",\n\t\"version\": \"0.0.1\",\n  \t\"description\": \"Reusable middleware implementation for Node.js & the browsers\",\n  \t\"scripts\": [\"index.js\"],\n  \t\"dependencies\": {\n  \t\t\"aheckmann/sliced\":  \"*\"\n  \t}\n}","/home/jkroso/Dev/Libraries/Big File/example/component/rack/components/sliced":"module.exports = require(\"aheckmann-sliced\")","/home/jkroso/Dev/Libraries/Big File/example/component/rack/index.js":"var slice = require('sliced')\n  , splice = Array.prototype.splice\n\n/**\n * Racks.\n *\n * @constructor\n */\n\nfunction Racks() {\n  this.stack = [];\n  this.between = [];\n};\n\n/**\n * Register a middleware.\n *\n * @param {Function} fn\n * @returns {Racks} `this`\n * @api public\n */\n\nRacks.prototype.push =\nRacks.prototype.use = function(fn) {\n  this.stack.push(fn);\n  return this;\n};\n\n/**\n * Register a function executed\n * after each middleware.\n *\n * @param {Function} fn\n * @returns {Racks} `this`\n * @api public\n */\n\nRacks.prototype.after = function(fn) {\n  this.between.push(fn);\n  return this;\n};\n\n/**\n * Trigger the middlewares.\n *\n * @param {Mixed} param1\n * @param {Mixed} param2..\n * @api public\n */\n\nRacks.prototype.send = function() {\n  var stack = this.batch()\n    , self = this\n\n  function next() {\n    var fn = stack.shift()\n      , args = slice(arguments);\n\n    args.push(next);\n    if (fn) fn.apply(self, args);\n  }\n\n  next.apply(this, arguments);\n};\n\n/**\n * Return the stack. Apply the after\n * callbacks.\n *\n * @returns {Array}\n * @api private\n */\n\nRacks.prototype.batch = function() {\n  var stack = this.stack\n    , between = this.between\n    , len = stack.length\n\n  if (!len || !between.length) return stack;\n\n  stack = stack.slice()\n  between = [len - 1, 0].concat(between)\n  \n  do {\n    splice.apply(stack, between)\n  } while (--between[0])\n\n  return stack\n};\n\n/*!\n * Export `Racks`.\n */\n\nmodule.exports = Racks;\n","/home/jkroso/Dev/Libraries/Big File/example/component/components/aheckmann-sliced/component.json":"module.exports = {\n\t\"name\": \"sliced\",\n\t\"version\": \"0.0.4\",\n\t\"scripts\": [\"index.js\"]\n}","/home/jkroso/Dev/Libraries/Big File/example/component/components/aheckmann-sliced/index.js":"\n/**\n * An Array.prototype.slice.call(arguments) alternative\n *\n * @param {Object} args something with a length\n * @param {Number} slice\n * @param {Number} sliceEnd\n * @api public\n */\n\nmodule.exports = function () {\n  var args = arguments[0];\n  var slice = arguments[1];\n  var sliceEnd = arguments[2];\n\n  var ret = [];\n  var len = args.length;\n\n  if (0 === len) return ret;\n\n  var start = slice < 0\n    ? Math.max(0, slice + len)\n    : slice || 0;\n\n  var end = 3 === arguments.length\n    ? sliceEnd < 0\n      ? sliceEnd + len\n      : sliceEnd\n    : len;\n\n  while (end-- > start) {\n    ret[end - start] = args[end];\n  }\n\n  return ret;\n}\n"}
checks = [node_modules, components]
return require("/home/jkroso/Dev/Libraries/Big File/example/component/rack/component.json")
})