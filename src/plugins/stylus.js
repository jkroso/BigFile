var stylus = require('stylus')
  , Promise = require('laissez-faire/full')

exports.handlers = [ TransformStylus ]

function TransformStylus(file, options) {
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

TransformStylus.test = function(file){
	if (/\.styl$/.test(file.path)) return 1
}

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
