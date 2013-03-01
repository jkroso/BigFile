/**
 * Wrap the code in a univeral module definer (UMD)
 * This will protect the code from creating globals also since everything ends 
 * up being wrapped in function. UMD covers commonjs, AMD, and falls back to
 * global exports
 *
 * @param {String} code
 * @param {Function} next
 * @return {String}
 */

module.exports = function (code, next) {
	next(umd(this.name, this.entry, code))
}

function umd (name, entryPath, code) {
	return [
	    "!function (context, definition) {"
	  , "	if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {"
	  , "		module.exports = definition()"
	  , "	} else if (typeof define === 'function' && typeof define.amd  === 'object') {"
	  , "		define(definition)"
	  , "	} else {"
	  , "		" + (name === 'null' || name === null ? "" : "context['"+name+"'] = ") + "definition()"
	  , "	}"
	  , "}(this, function () {"
	   // indent and remove carriage returns
	  , code.replace(/^/mg, '\t').replace(/\r/g, '')
	  , "	return require("+JSON.stringify(entryPath)+")"
	  , "})"
	].join('\n')
}