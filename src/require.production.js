/*global modules*/

function require (index) {
	var module = modules[index]
	// It hasn't been loaded before
	if (typeof module === 'string') {
		new Function(
			'module',
			'exports',
			'require',
			"eval("+JSON.stringify(module+'\n//@ sourceURL=/'+index)+")"
			// module
		)
		.call((modules[index] = module = {exports:{}}).exports, 
			module,
			module.exports,
			require
		)
	}
	return module.exports
}