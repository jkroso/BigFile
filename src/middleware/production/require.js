function require (index) {
	var module = modules[index]
	// It hasn't been loaded before
	if (typeof module === 'string') {
		new Function(
			'module',
			'exports',
			'require',
			module
			// "eval("+JSON.stringify(module+'\n//@ sourceURL=/'+index)+")"
		)
		.call((modules[index] = module = {exports:{}}).exports, 
			module,
			module.exports,
			require
		)
	}
	return module.exports
}