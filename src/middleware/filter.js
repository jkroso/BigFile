var debug = require('debug')('filter')

/**
 * Filter out the files that match an excluding regexp
 * 
 * @param {Array} files
 * @param {Function} next
 */

module.exports = function (files, next) {
  var exclude = this._excludes

  files = files.filter(function (file) {
    return !exclude.some(function (re) {
      if (re.test(file.path)) {
        debug('Excluding %s since it matches %s', file.path, re)
        return true
      }
    })
  })

  next(files)
}