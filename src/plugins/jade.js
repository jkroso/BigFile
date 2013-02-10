var jade = require('jade')
  , read = require('fs').readFileSync

exports.handlers = [
	{
		if: /\.jade$/,
		do: function (file, options) {
			var requires = []
			var text = file.text.replace(/^require\s*(.+)/mg, function (_, req) {
				requires.push(req)
				return ''
			})
			var fn = jade.compile(text, {
					client: true,
					compileDebug: options && options.debug,
					filename: file.path
				}).toString()
				.replace(/anonymous/, '')
				.replace(/\n[^\n]*/, '')

			file.text = [
				'var runtime = require(\'/node_modules/jade-runtime.js\')',
				'var fn = '+fn,
				'module.exports = function (locals) {',
				'	return fn(locals, runtime.attrs, runtime.escape, runtime.rethrow, runtime.merge)',
				'}'
			].concat(requires.map(function (req) {
				return 'require(\''+req+'\')'
			})).join('\n')

			return file
		}
	}
]

var runtime = read(require.resolve('jade/lib/runtime'), 'utf-8')
	+ [
		'',
		'exports.rethrow = function rethrow(err, filename, lineno){',
		'	err.path = filename',
		'	err.message = (filename || \'Jade\') + \':\' + lineno + \' \'+ err.message',
		'	throw err',
		'}',
		''
	].join('\n')

exports.dependencies = [
	{
		path: '/node_modules/jade-runtime.js',
		text: runtime
	}
]
