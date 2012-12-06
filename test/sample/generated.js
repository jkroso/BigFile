(function(){function require(p, context, parent){ context || (context = 0); var path = require.resolve(p, context), mod = require.modules[context][path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if(mod.context) { context = mod.context; path = mod.main; mod = require.modules[context][mod.main]; if (!mod) throw new Error('failed to require "' + path + '" from ' + context); } if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path, context)); } return mod.exports;}require.modules = [{}];require.resolve = function(path, context){ var orig = path, reg = path + '.js', index = path + '/index.js'; return require.modules[context][reg] && reg || require.modules[context][index] && index || orig;};require.relative = function(relativeTo, context) { return function(p){ if ('.' != p.charAt(0)) return require(p, context, relativeTo); var path = relativeTo.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), context, relativeTo); };};
require.modules[0] = { "index.js": function(module, exports, require){eval("module.exports = {\n  a: require('./models/a.js'),\n  b: require('./models/b.js'),\n  init: init\n};\n\nfunction init() {\n  console.log(require('model').a);\n  console.log(require('model').b);\n}\n\n//@ sourceURL=/index.js");},"model": function(module, exports, require){module.exports = require("./models");}
,"models/a.js": function(module, exports, require){eval("module.exports = 'Module A';\n\n//@ sourceURL=/models/a.js");},"models/b.js": function(module, exports, require){eval("module.exports = 'Module B';\n\n//@ sourceURL=/models/b.js");},"models/index.js": function(module, exports, require){eval("module.exports = {\n  a: require('./a.js'),\n  b: require('./b.js')\n};\n\n//@ sourceURL=/models/index.js");}};
myApp = require('index.js');
}());