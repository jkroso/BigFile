module.exports = [
  {
    "id": "/expandindex/index.js",
    "source": "exports.foo = require('foo')"
  },
  {
    "id": "/node_modules/foo/index.js",
    "source": "exports.bar = 'baz';"
  }
]