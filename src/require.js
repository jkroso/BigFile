/*global modules*/

/**
 * Require the given path.
 *
 * @param {String} path   Full path to the required file
 * @param {String} parent The file which this call originated from
 * @return {Object} exports
 */
function require (path, parent){
	// Determine the correct path
	path = resolve(parent, path)
	var module = modules[path]
	if (!module) throw new Error('failed to require "'+path+'" from '+parent)
	// It hasn't been loaded before
	if (typeof module === 'string') {
		new Function(
			'module', 
			'exports', 
			'require', 
			// Eval prevents the function wrapper being visible
			"eval("+JSON.stringify(module+'\n//@ sourceURL='+encodeURI(path))+")"
			// module
		)
		.call((modules[path] = module = {exports:{}}).exports, 
		    module, 
		    module.exports, 
			// Relative require function
		    function (relp) {
				return require('.' === relp[0] ? join(path, relp) : relp, path)
			}
		)
	}
	return module.exports
}

function resolve (base, path) {
	if (path[0] === '/' || path.match(/^[a-zA-Z]+:/)) {
		return modules[path] && path
			|| modules[path+'.js'] && path+'.js'
			|| modules[path+'.json'] && path+'.json'
			|| modules[path+'index.js'] && path+'index.js'
			|| modules[path+'/index.js'] && path+'/index.js'
	}
	else {
		var res
        do {
            for ( var i = 0, len = checks.length; i < len; i++ ) {
                if (res = checks[i](modules, base, path)) return res
            }
        } while ((base = parentDir(base)) !== '/') 
	}
}

function parentDir (path) {
	return path.split('/').slice(0,-1).join('/')
}

var checks = [
    function node_modules (hash, base, name) {
        if (hash['/node_core/'+name+'.js']) return '/node_core/'+name+'.js'
        return [
            name,
            name+'.js',
            name+'.json',
            name+'/index.js',
            name+'/index.json',
            name+'/package.json',
        ]
        .map(function (p) {
            return base+'/node_modules/'+p
        })
        .filter(function (p) {
            return !!hash[p]
            
        })[0]
    },
    function components (hash, base, name) {
        return [
            // Check for an alias...
            name,
            // ...and a real component
            name+'/component.json'
        ]
        .map(function (p) {
            return base+'/components/'+p
        })
        .filter(function (p) {
            return !!hash[p]
        })[0]
    }
]

function join (a, b) { 
	var path = a.split('/').slice(0, -1),
		segs = b.split('/'),
		i = -1

	while (++i < segs.length) {
		if ('..' === segs[i]) path.pop()
		else if ('.' !== segs[i]) path.push(segs[i])
	}

	return path.join('/')
}