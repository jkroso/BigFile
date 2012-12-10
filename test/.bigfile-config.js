module.exports = function (config) {
	config.compileTime.handlers.unshift({
		if: /\/component\.json$/,
		do: function (file) {
			file.text = 'module.exports = "I\'ve been fucked with"'
			return file
		}
	})
}