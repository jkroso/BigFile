
var SourceMap = require('source-map/lib/source-map/source-map-generator').SourceMapGenerator
var read = require('fs').readFileSync

var prelude = read(__dirname+'/require.js', 'utf-8')

/**
 * Wrap a mapping of modules with the environment required to run them
 *
 * @param {Object} dict, maps paths to content
 * @param {Function} next
 * @return {String}
 */

module.exports = function(files){
	var sourcemap = new SourceMap({
		file: this.entry
	})
	var src = prelude.replace(/.$/, '{\n')
	var cursor = newLines(src) + 1
	files.forEach(function(file){
		var text = file.text
		var path = file.path
		sourcemap.setSourceContent(path, text)
		src += '"' + path + '": function(module,exports,require){\n' + text + '\n},'
		var lines = newLines(text)
		var line = 0
		while (line++ <= lines) {
			sourcemap.addMapping({
				source: path,
				original: { line: line, column: 0 },
				generated: { line: line + cursor, column: 0 }
			})
		}
		cursor += lines + 2
	})
	return src.slice(0, -1) + '},'
		+ json(mapAliases(files)) + ')\n'
		+ inlineSourcemap(sourcemap)
}

function newLines(str){
	var m = str.match(/\n/g)
	return m ? m.length : 0
}

function inlineSourcemap(map){
	return '//# sourceMappingURL=data:application/json;base64,'
		+ new Buffer(map.toString()).toString('base64')
}

/**
 * map aliases to their real paths
 * 
 * @param {Array} files
 * @return {Object}
 */

function mapAliases(files){
	return files.reduce(function(map, file){
		if (!('aliases' in file)) return map
		return file.aliases.reduce(function(map, alias){
			map[alias] = file.path
			return map
		}, map)
	}, {})
}

function json(obj){
	return JSON.stringify(obj, null, 2)
}