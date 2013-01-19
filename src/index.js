var Emitter = require('emitter')
  , Rack = require('racks')
  , Graph = require('sourcegraph')
  , dirname = require('path').dirname
  , resolve = require('path').resolve
  , debug = require('debug')('bigfile')

exports = module.exports = Build

function Build (name) {
	Emitter.call(this)
	Rack.call(this)
	this.graph = new Graph().use(
		'nodeish', 
		'component', 
		'javascript', 
		'json', 
		'css'
	)

	this.name = name === null 
		? null 
		: (name || 'undefined-bigfile-build')
	this._excludes = []
	this._handlers = []
	
	this.options = {
		debug: true,
		min: {
			compress: false,
			beautify: true,
			leaveAst: false
		}
	}

	// Ship with javascript by default
	this.plugin('javascript', 'json')
}

/*!
 * Inherit from Emitter
 */
var proto = Build.prototype
proto.__proto__ = Rack.prototype
Emitter.mixin(proto)

proto.debug = function (bool) {
	this.options.debug = bool
	return this
}

proto.include = function (p) {
	if (p[0] === '.') {
		p = resolve(dirname(module.parent.filename), p)
	}
	if (!this.entry) this.entry = p
	this.graph.trace(p)
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
	this.options.min = opts === false 
		? false 
		: merge(this.options.min, opts || {})
	return this
}

proto.run = function (fn) {
	var self = this
	if (fn) this.use(fn)
	this.graph.then(function (files) {
		self.send(files)
	}).throw()
}

var use = Rack.prototype.use

proto.use = function () {
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

proto.plugin = function () {
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
		
		plug.excludes && plug.excludes.forEach(function (regex) {
			self.exclude(regex)
		})
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