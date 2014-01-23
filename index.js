
var SourceMap = require('source-map/lib/source-map/source-map-generator').SourceMapGenerator
var fs = require('fs')

var prelude = fs.readFileSync(__dirname + '/prelude.js', 'utf-8')
var lines = newLines(prelude) + 1

/**
 * Wrap a mapping of modules with the environment required to run them
 *
 * @param {Object} dict, maps paths to content
 * @param {Function} next
 * @return {String}
 */

module.exports = function(files, offset){
  var entry = files[0].id
  var sourcemap = new SourceMap({ file: entry })
  var cursor = lines + (offset || 0)
  var src = prelude

  // sort for consistent output
  files.sort(function(a, b){
    if (b.id < a.id) return 1
    if (b.id > a.id) return -1
    return 0
  })

  files.forEach(function(file){
    var text = file.source
    var path = file.id
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

  return src.replace(/,$/, '},')
    + json(aliases(files)) + ')'
    + '("' + entry + '")\n'
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

function aliases(files){
  return files.reduce(function(map, file){
    var aliases = file.aliases || []
    for (var i = 0, len = aliases.length; i < len; i++) {
      map[aliases[i]] = file.id
    }
    return map
  }, {})
}

function json(obj){
  return JSON.stringify(obj, null, 2)
}
