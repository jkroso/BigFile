module.exports = [
	{
		id: "/a.js", 
		source: "module.exports = {has_dependency: true, dependency: require('./b')}"
	},
	{
		id: "/b.js",
		source: "require('./c')\nexports.simple = true"
	},
  {
    id: '/c.js',
    source: 'module.exports = "empty"'
  }
]