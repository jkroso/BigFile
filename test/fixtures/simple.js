module.exports = [
	{
		path: "/a.js", 
		text: "module.exports = {has_dependency: true, dependency: require('./b')}"
	},
	{
		path: "/b.js",
		text: "exports.simple = true"
	}
]