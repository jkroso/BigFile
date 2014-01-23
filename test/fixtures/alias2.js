module.exports = [
  {
    "id": "/project/index.js",
    "source": "exports.a = require('b');require('./sym');"
  },
  {
    "id": "/a/b.js",
    "source": "\'b\'",
    "aliases": [ "/project/sym" ]
  },
  {
    "id": "/a/b/index.js",
    "source": "exports.b = require('./c.js')",
    "aliases": [ "/node_modules/b.js" ]
  },
  {
    "id": "/a/b/c.js",
    "source": "exports.c = true"
  }
]