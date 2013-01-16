/**
 * Convert the files array to a map of paths to text
 *
 * @param {Array} files
 * @param {Function} next
 * @return {Object}
 */

module.exports = function (files, next) {
	next(
		files.reduce(function (o, next) {
			return o[next.path] = next.text, o
		}, {})
	)
}