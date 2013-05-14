
var Rack = require('racks')
var debug = require('debug')('bigfile')

module.exports = Build

/**
 * configuration and middleware hub
 * 
 * @param {String} [name]
 * @param {Array} files to compile
 */

function Build (name, files) {
	Rack.call(this)
	this.files = files
	this._handlers = []
	this.name = name === null 
		? null 
		: (name || 'undefined-build')
	this.options = {
		debug: true,
		min: {
			compress: false,
			beautify: true,
			leaveAst: false
		}
	}
}

// Inherit from Rack
Build.prototype.__proto__ = Rack.prototype

/**
 * create filtering middleware
 * 
 * @param {RegExp} regex
 * @return {Function}
 */

Build.filter = function(regex){
	return function(files, next){
		next(files.filter(function(file){
			return !regex.test(file.path)
		}))
	}
}

/**
 * set debug option
 * 
 * @param {Boolean} [bool=true]
 * @return {this}
 */

Build.prototype.debug = function (bool) {
	this.options.debug = bool !== false
	return this
}

/**
 * add a handler for a file type
 * 
 * @param {RegExp} re to match file paths
 * @param {Function} fn
 * @return {this}
 */

Build.prototype.handle = function (re, fn) {
	function transform(file){
		return fn(file)
	}
	transform.test = function(file){
		return re.test(file.path) ? 1 : 0
	}
	this._handlers.push(transform)
	return this
}

Build.prototype.minify = function (opts) {
	this.options.min = opts === false 
		? false 
		: merge(this.options.min, opts || {})
	return this
}

/**
 * run the build
 * 
 * @param {Function} fn
 * @return {this}
 */

Build.prototype.run = function (fn) {
	if (fn) this.use(fn)
	this.send(this.files)
}

var use = Rack.prototype.use

/**
 * add middleware
 * 
 * @param {String|Function} middleware
 * @return {this}
 */

Build.prototype.use = function (middleware) {
	if (typeof middleware === 'string') {
		debug('loading middleware: %s', middleware)
		middleware = require(__dirname+'/middleware/'+middleware)
	}
	use.call(this, middleware)
	return this
}

/**
 * add a plugin
 * 
 * @param {Object|String} plug
 * @return {this}
 */

Build.prototype.plugin = function (plug) {
	if (typeof plug === 'string') {
		debug('Loading plugin: %s', plug)
		plug = require(__dirname+'/plugins/'+plug)
	}

	if ('handlers' in plug)
		this._handlers = this._handlers.concat(plug.handlers)
	
	// TODO: this should be a deep merge
	plug.options && merge(this.options, plug.options)

	if (plug.dependencies) {
		this.files = this.files.concat(plug.dependencies)
	}

	return this
}

/*!
 * Merge helper
 */

function merge (a, b) {
	for (var prop in b) {
		a[prop] = b[prop]
	}
	return a
}
