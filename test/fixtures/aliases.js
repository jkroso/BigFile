module.exports = [
  {
    "id": "/expandindex/index.js",
    "source": "exports.foo = require('bar');require('./sym');"
  },
  {
    "id": "/expandindex/b",
    "source": "\'b\'",
    "aliases": [ "/expandindex/sym" ]
  },
  {
    "id": "/node_modules/foo/index.js",
    "source": "exports.bar = 'baz';",
    "aliases": [ "/node_modules/bar.js" ]
  }
]