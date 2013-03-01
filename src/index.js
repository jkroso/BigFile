var Rack = require('racks')
  , dirname = require('path').dirname
  , resolve = require('path').resolve
  , debug = require('debug')('bigfile')

module.exports = Build

function Build (name, files) {
	Rack.call(this)

	this.files = files

	this.name = name === null 
		? null 
		: (name || 'undefined-build')

	this._handlers = []
	
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

Build.filter = function(regex){
	return function(files, next){
		next(files.filter(function(file){
			return !regex.test(file.path)
		}))
	}
}

Build.prototype.debug = function (bool) {
	this.options.debug = bool
	return this
}

Build.prototype.handle = function (re, fn) {
	this._handlers.push({
		re: re,
		fn: fn
	})
	return this
}

Build.prototype.minify = function (opts) {
	this.options.min = opts === false 
		? false 
		: merge(this.options.min, opts || {})
	return this
}

Build.prototype.run = function (fn) {
	if (fn) this.use(fn)
	this.send(this.files)
}

var use = Rack.prototype.use

Build.prototype.use = function () {
	// Handle several arguments
	for (var i = 0, len = arguments.length; i < len; i++) {
		var middleware = arguments[i]
		if (typeof middleware === 'string') {
			debug('loading middleware: %s', middleware)
			middleware = require(__dirname+'/middleware/'+middleware)
		}
		use.call(this, middleware)
	}

	return this
}

Build.prototype.plugin = function () {
	var self = this

	for (var i = 0, len = arguments.length; i < len; i++) {
		var plug = arguments[i]
		if (typeof plug === 'string') {
			debug('Loading plugin: %s', plug)
			plug = require(__dirname+'/plugins/'+plug)
		}

		plug.handlers && plug.handlers.forEach(function (h) {
			debug('Plugin handler: %s', h.if)
			self.handle(h.if, h.do)
		})
		
		// TODO: this should be a deep merge
		plug.options && merge(this.options, plug.options)

		if (plug.dependencies) {
			this.files = this.files.concat(plug.dependencies)
		}
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
