
exports.handlers = [ transform ]
  .concat(require('./javascript').handlers)
  .concat(require('./json').handlers)

function transform(file){
  var data = JSON.parse(file.text)
  var main = data.main
  
  if (main) {
    if (main[0].match(/\w/)) main = './'+main
  } else {
    throw new Error(file.path+': has no `main` property')
  }
  
  file.text = 'module.exports = require("'+main+'")'
  
  return file
}

transform.test = function(file){
  if (!(/\/package\.json$/).test(file.path)) return 0
  try {
    var json = JSON.parse(file.text)
    if ('name' in json) return 3
  } catch (e) {
    return 0
  }
}
