var Emitter = require('jkroso-emitter'),
	Hash = require('hashish'),
	Graph = require('sourcegraph'),
	merge = Hash.merge,
	max = require('lodash').max,
	all = require('jkroso-promises').all,
	join = require('path').join,
	readSync = require('fs').readFileSync,
	uglify = require('uglify-js'),
	falafel = require('falafel'),
	fs = require('fs'),
	path = require('path'),
	dirname = path.dirname

exports = module.exports = Build

var config = require('./default-config');
// If the user has a config file run config through it
(function findConfig (dir) {
	if (fs.existsSync(dir+'/.bigfile-config.js')) {
		return require(dir+'/.bigfile-config.js')(config)
	}
	if (fs.existsSync(dir+'/.bigfile-config/index.js')) {
		return require(dir+'/.bigfile-config/index.js')(config)
	}
	if (dir !== '/') {
		return findConfig(path.dirname(dir))
	} 
})(process.cwd())

function Build (graph) {
	this.graph = graph || new Graph
	this.graph.fileTypes = config.resolveTime.fileTypes.slice()
	this.graph.hashResolvers = config.resolveTime.lookup.hash.slice()
	this.graph.osResolvers = config.resolveTime.lookup.file.slice()

	this._excludes = []
	config.compileTime.excludes.forEach(function (re) {
		this.exclude(re)
	}, this)
	this._handlers = []
	config.compileTime.handlers.forEach(function (handler) {
		this.handle(handler.if, handler.do)
	}, this)
	
	this.debug(true)
	this._min_options = {
		compress: false,
		beautify: true,
		leaveAst: false
	}
}

var proto = Build.prototype = Object.create(Emitter.prototype, {constructor:{value:Build}})

proto.entry = function (path) {
	this._entry = path
	return this
}

proto.debug = function (bool) {
	this._debug = bool
	return this
}

proto.include = function (path) {
	if (!this._entry) this.entry(path)
	this.graph.trace(path)
	return this
}

proto.export = function (ns) {
	this._export = ns
	return this
}

proto.exclude = function (re) {
	this._excludes.push(re)
	return this
}

proto.handle = function (re, fn) {
	this._handlers.push({
		re: re,
		fn: fn
	})
	return this
}

proto.minify = function (opts) {
	this._min_options = opts === false ? false : merge(this._min_options, opts || {})
	return this
}

/**
 * Apply handlers to file objects
 * @return {Promise} for an array of files
 */
proto.transform = function () {
	var exclude = this._excludes,
		handlers = this._handlers
	return this.graph.then(function (hash) {
		hash = new Hash(hash)
			.filter(function (_, key) {
				return !exclude.some(function (re) {
					if (re.test(key)) {
						console.log('Excluding '+key+' since it matches '+re)
						return true
					}
				})
			})
			.map(function (value, key) {
				var results = new Array(handlers.length)
				for ( var i = 0, len = handlers.length; i < len; i++ ) {
					results[i] = handlers[i].re.exec(key)
				}
				if (!results.length) 
					return console.warn('Excluding '+key+': No handler found')
				// The best result is judged to be the one with the longest regex munch
				len = max(results, function (res) {
					return res ? res[0].length : 0
				})
				return handlers[results.indexOf(len)].fn(value)
					|| console.warn('No value returned from the handler of '+key)
			})
			.compact
		return all(hash.values)
	})
}

proto.render = function (callback) {
	var self = this
	return this[this._debug ? 'development' : 'production']()
		.then(function (out) {
			return self._min_options !== false 
				? minify(out, self._min_options)
				: out
		})
		.then(callback)
		.throw()		
}

function minify (code, options) {
	var toplevel = uglify.parse(code)
	toplevel.figure_out_scope()
	if (!options.leaveAst) {
		toplevel.transform(uglify.Compressor())
		toplevel.figure_out_scope()
	}
	toplevel.compute_char_frequency()
	if (options.compress) toplevel.mangle_names()
	return toplevel.print_to_string({beautify:options.beautify})
}

proto.development = function () {
	var self = this
	return this.transform().then(function (files) {
		files = files.reduce(function (o, next) {
			return o[next.path] = next.text, o
		}, {})
		var requireCode = readSync(join(__dirname, '../src/require.js'), 'utf-8')
		requireCode = requireCode.replace(
			/\/node_core\//g, 
			dirname(require.resolve('sourcegraph'))+'/node_modules/'
		)
		return '!function(){\n'
			+ requireCode + '\n'
			+ 'var modules = ' + JSON.stringify(files) + '\n' 
			+ (self._export ? self._export+' = ' : '') + 'require("'+self._entry+'")\n'
			+ '}()'
	})
}

proto.production = function () {
	var self = this
	return this.transform().then(function (files) {
		var hash = {}, entry
		files.forEach(function (file, i) {
			file.index = i
			if (file.path === self._entry) entry = i
			file.text = minify(file.text, self._min_options)
			hash[file.path] = file
		})
		files = files.map(function (file) {
			return falafel(file.text, function (node) {
				if (isRequire(node)) {
					var name = node.arguments[0].value
					var path = self.graph.resolve(file.base, name)
					if (!path) throw new Error(name+' is needed for a production build')
					if (!hash[path]) throw new Error(name+' should not of resolved to '+path)
					node.update('require('+hash[path].index+')')
				}
			}).toString()
		})
		return '!function(){\n'
			+ readSync(join(__dirname, '../src/require.production.js'), 'utf-8') +'\n'
			+ 'var modules = ' + JSON.stringify(files) + '\n'
			+ (self._export ? self._export+' = ' : '') + 'require('+entry+')\n'
			+ '}()\n'

		function isRequire (node) {
			return node.type === 'CallExpression'
				&& (node = node.callee).type === 'Identifier'
				&& node.name === 'require'
		}
	})
}
