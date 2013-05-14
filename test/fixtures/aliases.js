module.exports = [
  {
    "path": "/expandindex/index.js",
    "text": "exports.foo = require('bar');require('./sym');"
  },
  {
    "path": "/expandindex/b",
    "text": "\'b\'",
    "aliases": [ "/expandindex/sym" ]
  },
  {
    "path": "/node_modules/foo/index.js",
    "text": "exports.bar = 'baz';",
    "aliases": [ "/node_modules/bar.js" ]
  }
]