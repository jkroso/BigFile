[
  {
    "path": "/path/to/rack/index.js",
    "text": "var slice = require('sliced')\n  , splice = Array.prototype.splice\n\n/**\n * Racks.\n *\n * @constructor\n */\n\nfunction Racks() {\n  this.stack = [];\n  this.between = [];\n};\n\n/**\n * Register a middleware.\n *\n * @param {Function} fn\n * @returns {Racks} `this`\n * @api public\n */\n\nRacks.prototype.push =\nRacks.prototype.use = function(fn) {\n  this.stack.push(fn);\n  return this;\n};\n\n/**\n * Register a function executed\n * after each middleware.\n *\n * @param {Function} fn\n * @returns {Racks} `this`\n * @api public\n */\n\nRacks.prototype.after = function(fn) {\n  this.between.push(fn);\n  return this;\n};\n\n/**\n * Trigger the middlewares.\n *\n * @param {Mixed} param1\n * @param {Mixed} param2..\n * @api public\n */\n\nRacks.prototype.send = function() {\n  var stack = this.batch()\n    , self = this\n\n  function next() {\n    var fn = stack.shift()\n      , args = slice(arguments);\n\n    args.push(next);\n    if (fn) fn.apply(self, args);\n  }\n\n  next.apply(this, arguments);\n};\n\n/**\n * Return the stack. Apply the after\n * callbacks.\n *\n * @returns {Array}\n * @api private\n */\n\nRacks.prototype.batch = function() {\n  var stack = this.stack\n    , between = this.between\n    , len = stack.length\n\n  if (!len || !between.length) return stack;\n\n  stack = stack.slice()\n  between = [len - 1, 0].concat(between)\n  \n  do {\n    splice.apply(stack, between)\n  } while (--between[0])\n\n  return stack\n};\n\n/*!\n * Export `Racks`.\n */\n\nmodule.exports = Racks;"
  },
  {
    "path": "/path/to/node_modules/sliced/index.js",
    "text": "module.exports = exports = require('./lib/sliced');"
  },
  {
    "path": "/path/to/node_modules/sliced/lib/sliced.js",
    "text": "\n/**\n * An Array.prototype.slice.call(arguments) alternative\n *\n * @param {Object} args something with a length\n * @param {Number} slice\n * @param {Number} sliceEnd\n * @api public\n */\n\nmodule.exports = function (args, slice, sliceEnd) {\n  var ret = [];\n  var len = args.length;\n\n  if (0 === len) return ret;\n\n  var start = slice < 0\n    ? Math.max(0, slice + len)\n    : slice || 0;\n\n  if (sliceEnd !== undefined) {\n    len = sliceEnd < 0\n      ? sliceEnd + len\n      : sliceEnd\n  }\n\n  while (len-- > start) {\n    ret[len - start] = args[len];\n  }\n\n  return ret;\n}"
  }
]