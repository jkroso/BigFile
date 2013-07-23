
var debug = require('debug')('bigfile:transform')
  , winner = require('winner')
  , map = require('map/async')

/**
 * Apply handlers to the file types they match
 *
 * @param {Array} files
 * @param {Function} next
 */

module.exports = function(files){
	var handlers = this._handlers
	var options = this.options

	return map(files, function(file){
		var match = winner(handlers, function (handler) {
			return handler.test(file)
		}, 1)

		if (match) {
			debug('before %j', file)
			file = match(file, options)
			debug('after %j', file)
		} else {
			debug('no transformation applied to %p', file.path)
		}

		return file
	})
}
