var minify = require('../utils').minify

/**
 * Run whatever comes in through uglifyjs. This mostly just 
 * gets rid of whitespace. It will also optimise the AST though 
 * which in some cases may provide significant size reductions
 * 
 * @param {String} files
 * @return {String}
 */

module.exports = function(code){
  return minify(code, {
    compress: true,
    beautify: false,
    leaveAst: false
  })
}
