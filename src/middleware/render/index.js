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