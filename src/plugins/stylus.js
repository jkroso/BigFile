var stylus = require('stylus')
  , Promise = require('laissez-faire')

exports.handlers = [
	{
		if: /\.styl$/,
		do: function (file, options) {
			var promise = new Promise

			stylus(file.text)
				.set('filename', file.path)
				.render(function(err, css){
					if (err) promise.reject(err)
					else {
						file.text = 'require(\'/node_modules/css-install.js\')('+JSON.stringify(css)+')'
						promise.resolve(file)
					}
				})

			return promise
		}
	}
]

exports.dependencies = [
	{
		path: '/node_modules/css-install.js',
		text: [
			'module.exports = function (text) {',
			'	var style = document.createElement(\'style\')',
			'	style.appendChild(document.createTextNode(text))',
			'	document.getElementsByTagName(\'head\')[0].appendChild(style)',
			'}'
		].join('\n')
	}
]
