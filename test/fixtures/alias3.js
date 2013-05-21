module.exports = [
  {
    "path": "/a/b/c/d.js",
    "text": "\'b\'",
    "aliases": [ "/a/b/sym" ]
  },
  {
    "path": "/a/b/index.js",
    "text": "exports.b = require('./c.js')",
    "aliases": [ "/a/b.js" ]
  },
  {
    "path": "/a/b/c.js",
    "text": "exports.c = true"
  }
]