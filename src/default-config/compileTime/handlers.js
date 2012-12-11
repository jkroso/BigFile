module.exports = [
	// Javascript
	{
		if: /\.js$/,
		do: function (file) {return file}
	},
	// Aliased components 
	{
		if: /\/components\/\w+$/,
		do: function (file) {return file}
	},
	// Node_module meta file
	{
		if: /\/package\.json$/,
		do: function (file) {
			var data = JSON.parse(file.text),
				main = data.main
			if (main) {
				if (main[0].match(/\w/)) main = './'+main
			}
			else {
				throw new Error('No main!')
				// main = data.directories
			}
			file.text = 'module.exports = require("'+main+'")'
			return file
		}
	},
	// Component meta file
	{
		if: /component\.json/,
		do: function (file) {
			var data = JSON.parse(file.text), 
				main = data.main
			if (!main) {
				for ( var i = data.scripts.length; i-- ; ) {
					if (data.scripts[i].match(/index\.js$/)) main = data.scripts[i]
				}
			}
			if (main) {
				if (main[0].match(/\w/)) main = './'+main
			}
			file.text = 'module.exports = require("'+main+'")'
			data.styles && data.styles.forEach(function (style) {
				file.text += '\nrequire("./'+style+'").install()'
			})
			return file
		}
	},
	// Plain json data
	{
		if: /\.json$/,
		do: function (file) {
			// Perhaps this should be json parsed I'm not sure but this works in the cases I have tried
			file.text = 'module.exports = '+file.text
			return file
		}
	},
	// crappy style sheets
	{
		if: /\.css$/,
		do: function (file) {
			file.text = 'var style = document.createElement(\'style\'), count = 0\n'
				+ 'style.appendChild(document.createTextNode('+JSON.stringify(file.text)+'))\n'
				+ 'exports.install = function () {\n'
				+ '  if (++count === 1) document.getElementsByTagName(\'head\')[0].appendChild(style)\n'
				+ '}\n'
				+ 'exports.remove = function () {\n'
				+ '  count = Math.max(0, --count)\n'
				+ '  if (count === 0) document.getElementsByTagName(\'head\')[0].removeChild(style)\n'
				+ '}\n'
			return file
		}
	},
	// Handlebars template
	{
		if: /\.hbs$/,
		do: function(file) {
			var Handlebars = require('handlebars').precompile
			var out = 'var Handlebars = require(\'handlebars-runtime\')'
				+ '\nmodule.exports = Handlebars.template('+Handlebars(file.text)+')'
			file.text = out.replace(
				/\s*helpers = helpers \|\| Handlebars\.helpers;\s*/,
				'\nhelpers || (helpers = Handlebars.helpers);\n'
			)
			return file
		} 
	}
]