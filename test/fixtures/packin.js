module.exports = [
  {
    "path": process.env.HOME + "/Dev/components/graph/index.js",
    "text": "\nvar toposort = require('toposort')\n\n/**\n * graph\n *\n * @param {Object} graph\n * @return {Function}\n */\n\nmodule.exports = function(graph){\n\tvar deps = toposort(makeEdges(graph))\n\treturn compile(graph, deps.reverse())\n}\n\n/**\n * compile to a function that computes each value of \n * the graph in the order specified by toposort\n * \n * @param {Object} graph\n * @param {Array} deps\n * @return {Function}\n */\n\nfunction compile(graph, deps){\n\tvar src = ''\n\tvar input = []\n\tvar last = ''\n\tdeps.forEach(function(dep){\n\t\tif (dep in graph) {\n\t\t\tvar fn = graph[dep].toString()\n\t\t\tvar params = fn.match(/\\((.*)\\)/)[1]\n\t\t\tif (usesThis(fn)) {\n\t\t\t\tsrc += '  var '+dep+' = $'+dep+'.call(this'\n\t\t\t\tif ((/\\w/).test(params)) {\n\t\t\t\t\tsrc += ',' + params\n\t\t\t\t}\n\t\t\t\tsrc += ')\\n'\n\t\t\t} else {\n\t\t\t\tsrc += '  var '+dep+' = $'+dep+'('+params+')\\n'\n\t\t\t}\n\t\t\tlast = dep\n\t\t} else {\n\t\t\tinput.unshift(dep)\n\t\t}\n\t})\n\tsrc += '  return '+last+'\\n'\n\tsrc = 'function('+input.join()+'){\\n'+src+'}'\n\treturn eval(vars(graph) + '('+src+')')\n}\n\nfunction usesThis(fn){\n\treturn (/\\bthis\\b/).test(fn)\n}\n\n/**\n * make graph keys accessable as variables\n * \n * @param {Object} graph\n * @return {String}\n */\n\nfunction vars(graph){\n\tvar src = ''\n\tfor (var p in graph) {\n\t\tsrc += 'var $'+p+' = graph[\"'+p+'\"];\\n'\n\t}\n\treturn src\n}\n\n/**\n * generate edges that toposort understands\n * \n * @param {Object} graph\n * @return {Array}\n */\n\nfunction makeEdges(graph){\n\tvar edges = []\n\tfor (var p in graph) {\n\t\tparams(graph[p]).forEach(function(dep){\n\t\t\tedges.push([p, dep])\n\t\t})\n\t}\n\treturn edges\n}\n\n/**\n * extract a functions parameter list\n * \n * @param {Function} fn\n * @return {Array}\n */\n\nfunction params(fn){\n\treturn fn.toString()\n\t\t.match(/\\((.*)\\)/)[1]\n\t\t.split(/ *, */)\n}\n",
    "parents": [],
    "children": [],
    "aliases": [],
    "requires": [
      "toposort"
    ]
  },
  {
    "path": process.env.HOME + "/.packin/-/github.com/marcelklehr/toposort/tarball/0.2.9/index.js",
    "text": "\nmodule.exports = toposort;\n\n/**\n * Topological sorting function\n * \n * @param {Array} edges\n * @returns {Array}\n */\n\nfunction toposort(edges) {\n   var nodes = uniqueNodes(edges)\n     , index = nodes.length\n     , sorted = new Array(index)\n\n  while (index) visit(nodes[0], [])\n\n  return sorted\n\n  function visit(node, predecessors) {\n    if(predecessors.indexOf(node) >= 0) {\n      throw new Error('Cyclic dependency: '+JSON.stringify(node))\n    }\n\n    var i = nodes.indexOf(node)\n    \n    // already visited\n    if (i < 0) return;\n\n    nodes.splice(i, 1)\n\n    // outgoing edges\n    var out = edges.filter(function(edge){\n      return edge[0] === node\n    })\n    if (i = out.length) {\n      var preds = predecessors.concat(node)\n      do {\n        visit(out[--i][1], preds)\n      } while (i)\n    }\n    \n    sorted[--index] = node\n  }\n}\n\nfunction uniqueNodes(arr){\n  var res = []\n  for (var i = 0, len = arr.length; i < len; i++) {\n    var edge = arr[i]\n    if (res.indexOf(edge[0]) < 0) res.push(edge[0])\n    if (res.indexOf(edge[1]) < 0) res.push(edge[1])\n  }\n  return res\n}\n",
    "parents": [
      process.env.HOME + "/Dev/components/graph/index.js"
    ],
    "children": [],
    "aliases": [
      process.env.HOME + "/Dev/components/graph/node_modules/toposort/index.js"
    ],
    "requires": []
  }
]
