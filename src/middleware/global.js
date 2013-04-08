/**
 * Wrap in an iife but still export a global if it hasn't been set to false
 *
 * @param {String} code
 * @param {Function} next
 * @return {String}
 */

module.exports = function (code, next) {
	next(wrap(this.name, this.entry, code))
}

function wrap (name, entryPath, code) {
	var src = "!function(){"+ code

	if (name !== false) {
		src += "window["+JSON.stringify(name) + "]="
	}
	src += "require("+JSON.stringify(entryPath)+")"+"}()"
	return src
}