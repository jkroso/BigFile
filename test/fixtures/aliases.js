module.exports = [
  {
    "id": "/project/index.js",
    "source": "exports.a = require('b');require('./sym');",
    "deps": {'b':'/a/b/index.js', './sym': '/a/b.js'}
  },
  {
    "id": "/a/b.js",
    "source": "\'b\'",
    "aliases": [ "/project/sym" ],
    "deps": {}
  },
  {
    "id": "/a/b/index.js",
    "source": "exports.b = require('./c.js')",
    "aliases": [ "/node_modules/b.js" ],
    "deps": {'./c.js': '/a/b/c.js'}
  },
  {
    "id": "/a/b/c.js",
    "source": "exports.c = true",
    "deps": {}
  }
]