var debug = require('debug')('transform')
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
		// The best result is judged to be the one with the longest regex munch
		var match = winner(handlers, function (handler) {
			var res = file.path.match(handler.re)
			return (res && res[0].length) || 0
		}, 1)

		if (match) {
			debug('File before %pj', file)
			file = match.fn(file, options)
			debug('File after %pj', file)
			return file
		} else {
			debug('No handler found for %s, it will be excluded', file.path)
		}
	})
	// Remove those which returned nothing
	.filter(Boolean)
	// TODO: implment when-filter

	all(files).end(next)
}