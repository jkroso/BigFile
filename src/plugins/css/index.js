exports.handlers = [
	// crappy style sheets
	{
		if: /\.css$/,
		do: function (file) {
			file.text = [
				'var style = document.createElement(\'style\'), count = 0',
				'style.appendChild(document.createTextNode('+JSON.stringify(file.text)+'))',
				'exports.install = function () {',
				'  if (++count === 1) document.getElementsByTagName(\'head\')[0].appendChild(style)',
				'}',
				'exports.remove = function () {',
				'  count = Math.max(0, --count)',
				'  if (count === 0) document.getElementsByTagName(\'head\')[0].removeChild(style)',
				'}'
			].join('\n')
			return file
		}
	}
]