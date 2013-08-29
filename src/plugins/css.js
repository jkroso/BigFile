exports.handlers = [ transform ]

function transform(file){
	file.text = 'require(\'/node_modules/css-install.js\')('+JSON.stringify(file.text)+')'
	return file
}

transform.test = function(file){
	return Number((/\.css$/).test(file.path))
}

exports.dependencies = [
	{
		path: '/node_modules/css-install.js',
		text: [
			'module.exports = function(text){',
			'	var style = document.createElement(\'style\')',
			'	style.appendChild(document.createTextNode(text))',
			'	document.head.appendChild(style)',
			'}'
		].join('\n')
	}
]