module.exports = [
  {
    "id": "/expandindex/index.js",
    "source": "exports.foo = require('foo')",
    "deps": {foo: "/node_modules/foo/index.js"}
  },
  {
    "id": "/node_modules/foo/index.js",
    "source": "exports.bar = 'baz';"
  }
]