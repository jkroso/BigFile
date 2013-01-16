var Emitter = require('emitter')
  , Rack = require('racks')
  , Graph = require('sourcegraph')
  , dirname = require('path').dirname
  , resolve = require('path').resolve

exports = module.exports = Build

function Build () {
	Emitter.call(this)
	Rack.call(this)
	this.graph = new Graph().use(
		'nodeish', 
		'component', 
		'javascript', 
		'json', 
		'css'
	)

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

proto.entry = function (path) {
	this._entry = path
	return this
}

proto.debug = function (bool) {
	this.options.debug = bool
	return this
}

proto.include = function (p) {
	if (p[0] === '.') {
		p = resolve(dirname(module.parent.filename), p)
	}
	if (!this._entry) this.entry(p)
	this.graph.trace(p)
	return this
}

proto.export = function (ns) {
	this.options.export = ns
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
	this.graph.then().end(function (files) {
		self.send(files)
		fn && fn()
	})
}

var use = Rack.prototype.use
proto.use = function (fn) {
	if (typeof fn === 'string') {
		fn = require(__dirname+'/middleware/'+fn)
	}
	return use.call(this, fn)
}

proto.plugin = function (plug) {
	// Handle several arguments
	if (arguments.length > 1) {
		for (var i = 0, len = arguments.length; i < len; i++) {
			this.plugin(arguments[i])
		}
		return this
	}

	var self = this
	if (typeof plug === 'string')
		plug = require(__dirname+'/plugins/'+plug)

	plug.handlers && plug.handlers.forEach(function (h) {
		self.handle(h.if, h.do)
	})
	
	// TODO: this should be a deep merge
	plug.options && merge(this.options, plug.options)
	
	plug.excludes && plug.excludes.forEach(function (regex) {
		self.exclude(regex)
	})

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