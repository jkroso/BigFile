module.exports = [
	{
		id: "/a.js", 
		source: "module.exports = {has_dependency: true, dependency: require('./b')}",
    deps: {'./b':'/b.js'}
	},
	{
		id: "/b.js",
		source: "require('./c')\nexports.simple = true",
    deps: {'./c': '/c.js'}
	},
  {
    id: '/c.js',
    source: 'module.exports = "empty"',
    deps: {}
  }
]