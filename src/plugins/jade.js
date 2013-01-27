var jade = require('jade')

exports.handlers = [
	{
		if: /\.jade$/,
		do: function (file, options) {
			var fn = jade.compile(file.text, {
					client: true,
					compileDebug: options && options.debug,
					filename: file.path
				}).toString()
				.replace(/anonymous/, '')
				.replace(/\n[^\n]*/, '')

			file.text = [
				'var runtime = require(\'jade-runtime\')',
				'var fn = '+fn,
				'module.exports = function (locals) {',
				'	return fn(locals, runtime.attrs, runtime.escape, runtime.rethrow, runtime.merge)',
				'}'
			].join('\n')

			return file
		}
	}
]