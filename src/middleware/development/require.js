/**
 * Require the given path.
 *
 * @param {String} path
 * @param {String} parent
 * @return {Any} module.exports
 */

function require (path, parent){
	parent || (parent = '/')

	var fullpath = resolve(parent, path)
	if (!(fullpath in modules)) throw Error('failed to require '+path+' from '+parent)
	var module = modules[fullpath]

	if (!module.loaded) {
		Function(
			'module',
			'exports',
			'require',
			// sourceURL tells the browser we are evaling a file
			module.source + '\n//@ sourceURL=' + encodeURI(fullpath)
		).call(module.exports, module, module.exports,
			// relative `require` function
			function(path){
				var base = dirname(fullpath)
				if (path[0] == '.') path = join(base, path)
				return require(path, base)
			}
		)
	}
	return module.exports
}

/**
 * Figure out what the full path to the module is
 *
 * @param {String} base, the current directory
 * @param {String} path, what was inside the call to require
 * @return {String}
 * @api private
 */

function resolve (base, path) {
	// absolute
	if (/^\/|(?:\w+:\/\/)/.test(path)) {
		return complete(path)
	} else if (/^\./.test(path)) {
		// todo: fix join for urls
		return complete(join(base, path))
	}

	// walk up looking in node_modules
	while (true) {
		var res = complete(join(base, 'node_modules', path))
		if (res) return res
		if (base == '/') break
		base = dirname(base)
	}
}

/**
 * get the parent directory path
 *
 * @param {String} path
 * @return {String}
 */

function dirname(path){
	var i = path.lastIndexOf('/')
	if (i < 0) return '.'
	return path.slice(0, i)
}

/**
 * Clean up a messy path
 *
 *   normalize('/foo//baz/quux/..') // => '/foo/baz'
 *
 * @param {String} path
 * @return {String}
 */

function normalize(path){
  var segs = path.split('/')
  if (segs.length <= 1) return path
  var res = [segs[0]]

  for (var i = 1, len = segs.length; i < len; i++) {
    var seg = segs[i]
    if (seg === '' || seg === '.') continue
    if (seg === '..') res.pop()
    else res.push(seg)
  }

  return res.join('/')
}

/**
 * Concatenate a sequence of path segments to generate one flat path
 * 
 * @param {String} [...]
 * @return {String}
 */

function join(path){
	for (var i = 1, len = arguments.length; i < len; i++) {
		path += '/' + arguments[i]
	}
  return normalize(path)
}

/**
 * Produce an ordered list of paths to try
 * 
 * @param {String} path
 * @return {Array} of path
 * @private
 */

function completions(path){
	// A directory
	if (path.match(/\/$/)) {
		return [
			path+'index.js',
			path+'index.json',
			path+'package.json'
		]
	}
	// could be a directory or a file
	return [
		path,
		path+'.js',
		path+'.json',
		path+'/index.js',
		path+'/index.json',
		path+'/package.json'
	]
}

/**
 * find the first matching path completion
 *
 * @param {String} path
 * @return {String} full path of the module
 */

function complete(path) {
	return completions(path).filter(function (path) {
		return path in modules
	})[0]
}
