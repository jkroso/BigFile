module.exports = [
  {
    "path": "/project/index.js",
    "text": "exports.a = require('b');require('./sym');"
  },
  {
    "path": "/a/b.js",
    "text": "\'b\'",
    "aliases": [ "/project/sym" ]
  },
  {
    "path": "/a/b/index.js",
    "text": "exports.b = require('./c.js')",
    "aliases": [ "/node_modules/b.js" ]
  },
  {
    "path": "/a/b/c.js",
    "text": "exports.c = true"
  }
]