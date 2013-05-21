
var debug = require('debug')('bigfile:transform')
  , all = require('when-all')
  , winner = require('winner')

/**
 * Apply handlers to the file types they match
 *
 * @param {Array} files
 * @param {Function} next
 */

module.exports = function (files, next) {
	var handlers = this._handlers
	var options = this.options

	files = files.map(function (file) {
		var match = winner(handlers, function (handler) {
			return handler.test(file)
		}, 1)

		if (match) {
			debug('File before %j', file)
			file = match(file, options)
			debug('File after %j', file)
		} else {
			debug('No transformation applied to %p', file.path)
		}

		return file
	})

	all(files).read(next)
}
