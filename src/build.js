
var debug = require('debug')('bigfile')
var when = require('when')

module.exports = Build

/**
 * configuration and middleware hub
 * 
 * @param {String} [name='myProject']
 * @param {String} [entry] path
 */

function Build (name, entry) {
	this._handlers = []
	this._extraFiles = []
	this._transformations = []
	this.entry = entry || ''
	this.name = name === null 
		? null 
		: (name || 'myProject')
	this.options = {
		debug: true,
		min: {
			compress: false,
			beautify: true,
			leaveAst: false
		}
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

Build.prototype.minify = function(opts){
	this.options.min = opts === false 
		? false 
		: merge(this.options.min, opts || {})
	return this
}

/**
 * add a transformation
 * 
 * @param {String|Function} fn
 * @return {this}
 */

Build.prototype.use = function(fn){
	if (typeof fn === 'string') {
		debug('loading middleware: %s', fn)
		fn = require(__dirname+'/middleware/'+fn)
	}
	this._transformations.push(fn)
	return this
}

/**
 * run the build
 */

Build.prototype.send = function(files){
	var trans = this._transformations.slice(1)
	var fn = this._transformations[0]
	var self = this
	return trans.reduce(function(res, fn){
		return when(res, function(arg){
			return fn.call(self, arg)
		})
	}, fn.call(this, this._extraFiles.concat(files)))
}

/**
 * add a plugin
 * 
 * @param {Object|String} plug
 * @return {this}
 */

Build.prototype.plugin = function(plug){
	if (typeof plug === 'string') {
		debug('Loading plugin: %s', plug)
		plug = require(__dirname+'/plugins/'+plug)
	}

	if ('handlers' in plug) {
		this._handlers = this._handlers.concat(plug.handlers)
	}
	
	// TODO: this should be a deep merge
	plug.options && merge(this.options, plug.options)

	if (plug.dependencies) {
		this._extraFiles = this._extraFiles.concat(plug.dependencies)
	}

	return this
}

/*!
 * Merge helper
 */

function merge(a, b){
	for (var prop in b) {
		a[prop] = b[prop]
	}
	return a
}
