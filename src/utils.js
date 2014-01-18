var uglify = require('uglify-js')

exports.minify = function (code, options) {
  var toplevel = uglify.parse(code)
  toplevel.figure_out_scope()
  
  if (!options.leaveAst) {
    toplevel.transform(uglify.Compressor())
    toplevel.figure_out_scope()
  }
  toplevel.compute_char_frequency()
  
  if (options.compress) toplevel.mangle_names()
  
  return toplevel.print_to_string({
    beautify: options.beautify
  })
}