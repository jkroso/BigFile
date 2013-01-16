var debug = require('debug')('transform')
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
	  , options = this.options

	files = files.map(function (file) {
		var i = handlers.length
		  , results = new Array(i)

		while (i--) {
			results[i] = file.path.match(handlers[i].re)
		}
		debug('Handler results %pj', results)
		// The best result is judged to be the one with the longest regex munch
		var match = winner(results, function (res) {
			return res && res[0].length
		})
		debug('Winning regex won with: %pj', match)
		i = results.indexOf(match)

		debug('File before %pj', file)
		file = handlers[i].fn(file, options)
		debug('File after %pj', file)
		
		return file
	})
	// Remove those which returned nothing
	// TODO: implment when-filter
	.filter(Boolean)

	all(files).end(next)
}