exports.handlers = [
	// crappy style sheets
	{
		if: /\.css$/,
		do: function (file) {
			file.text = 'require(\'/node_modules/css-install.js\')('+JSON.stringify(file.text)+')'
			return file
		}
	}
]

exports.dependencies = [
	{
		path: '/node_modules/css-install.js',
		text: [
			'module.exports = function (text) {',
			'	var style = document.createElement(\'style\')',
			'	style.appendChild(document.createTextNode(JSON.stringify(text)))',
			'	document.getElementsByTagName(\'head\')[0].appendChild(style)',
			'}'
		].join('\n')
	}
]