exports.handlers = [
	// Aliased components 
	{
		if: /\/components\/\w+$/,
		do: function (file) {return file}
	},
	// Component meta file
	{
		if: /\/component\.json$/,
		do: function (file) {
			var data = JSON.parse(file.text), 
				main = data.main
			if (!main) {
				for ( var i = data.scripts.length; i-- ; ) {
					if (data.scripts[i].match(/index\.js$/)) {
						main = data.scripts[i]
						break
					}
				}
			}
			if (main) {
				if (main[0].match(/\w/)) main = './'+main
			}
			file.text = 'module.exports = require("'+main+'")'

			// Install style 
			data.styles && data.styles.forEach(function (style) {
				file.text += '\nrequire("./'+style+'").install()'
			})
			
			return file
		}
	},
]