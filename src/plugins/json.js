
exports.handlers = [ transform ]

function transform(file) {
  // TODO: find out if this actually works in all cases
  file.text = 'module.exports = '+file.text
  return file
}

transform.test = function(file){
  if (!(/\.json$/).test(file.path)) return 0
  try {
    JSON.parse(file.text)
    return 2
  } catch (e) { return 0 }
}
