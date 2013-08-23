/**
 * Wrap the code in a univeral module definer (UMD)
 * This will protect the code from creating globals since everything ends 
 * up being wrapped in function. UMD covers commonjs, AMD, and falls back to
 * global exports
 *
 * @param {String} code
 * @return {String}
 */

module.exports = function(code){
  var name = this.name
  var entry = this.entry
  return [
      "!function(context, definition){"
    , "  if (typeof require == 'function' && typeof exports == 'object') {"
    , "    module.exports = definition()"
    , "  } else if (typeof define == 'function' && typeof define.amd  == 'object') {"
    , "    define(definition)"
    , "  } else {"
    , "    " + (name == 'null' || name == null ? "" : "context['"+name+"'] = ") + "definition()"
    , "  }"
    , "}(this, function(){"
    , "  return " + code.replace(/\r/g, '').replace(/\n(.*)$/, "('" + entry + "')\n$1")
    , "})"
    , ""
  ].join('\n')
}