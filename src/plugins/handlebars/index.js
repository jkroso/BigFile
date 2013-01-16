var compile = require('handlebars').precompile

exports.handlers = [
	// Handlebars template
	{
		if: /\.hbs$/,
		do: make
	},
	{
		if: /\.handlebars$/,
		do: make
	}
]

function make (file) {
	var out = 'var Handlebars = require(\'handlebars-runtime\')\n'
		+ 'module.exports = Handlebars.template('+compile(file.text)+')'
	file.text = out.replace(
		/\s*helpers = helpers \|\| Handlebars\.helpers;\s*/,
		'\nhelpers || (helpers = Handlebars.helpers);\n'
	)
	return file
}