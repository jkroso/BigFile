exports.handlers = [
	// Plain json data
	{
		if: /\.json$/,
		do: function (file) {
			// TODO: find out if this actually works in all cases
			file.text = 'module.exports = '+file.text
			return file
		}
	}
]