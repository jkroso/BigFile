

exports.handlers = [ js ]

/**
 * The do nothing handler
 */

function js(a){
  return a
}

js.test = function(file){
  return (/\.js$/).test(file.path)
    ? 1
    : 0
}