
var debug = require('debug')('bigfile:transform')
  , all = require('when-all')
  , winner = require('winner')
  , path = require('path')

/**
 * Apply handlers to the file types they match
 *
 * @param {Array} files
 * @param {Function} next
 */

module.exports = function (files, next) {
	var handlers = this._handlers
	  , options = this.options

	files = files.map(function (file) {
		// TODO: better test
		var match = winner(handlers, function (handler) {
			var res = file.path.match(handler.re)
			return (res && res[0].length) || 0
		}, 1)

		if (!match) {
			debug('No handler found for %p, it will be excluded', file.path)
			return
		}

		debug('File before %j', file)
		file = match.fn(file, options)
		debug('File after %j', file)
		return file
	})

	all(files).end(function (files) {
		// Remove `undefined`
		next(files.filter(Boolean))
	})
}