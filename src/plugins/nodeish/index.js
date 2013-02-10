exports.handlers = [
	// Node_module meta file
	{
		if: /\/package\.json$/,
		do: function (file) {
			var data = JSON.parse(file.text)
			  , main = data.main
			
			if (main) {
				if (main[0].match(/\w/)) main = './'+main
			} else {
				throw new Error(file.path+': has no `main` property')
			}
			
			file.text = 'module.exports = require("'+main+'")'
			
			return file
		}
	}
]