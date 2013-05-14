exports.handlers = [ transform ]

function transform(file){
	file.text = 'require(\'/node_modules/css-install.js\')('+JSON.stringify(file.text)+')'
	return file
}

transform.test = function(file){
	return (/\.css$/).test(file.path)
		? 1
		: 0
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