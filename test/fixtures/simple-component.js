module.exports = [
	{
		path: "/simple/index.js",
		text: "exports.animal = require('animal')"
	},
	{
		path: "/simple/component.json",
		text: [
			'{',
			'	"name": "simple",',
			'	"dependencies": {',
			'		"jake/animal": "*"',
			'	},',
			'	"scripts": ["index.js"],',
			'	"version": "0.0.1"',
			'}'
		].join('\n')
	},
	{
		path: "/simple/components/jake-animal/index.js",
		text: "module.exports = require('inherit')"
	},
	{
		path: "/simple/components/jake-animal/component.json",
		text: [
			'{',
			'	"name": "animal",',
			'	"version": "1",',
			'	"scripts": ["index.js"],',
			'	"dependencies": {',
			'		"component/inherit": "*"',
			'	}',
			'}'
		].join('\n')
	},
	{
		path: "/simple/components/component-inherit/component.json",
		text: [
			'{',
			'	"name": "inherit",',
			'	"description": "inheritance utility",',
			'	"version": "0.0.1",',
			'	"scripts": ["index.js"]',
			'}'
		].join('\n')
	},
	{
		path: "/simple/components/component-inherit/index.js",
		text: "exports.inherit = 'simple'"
	}
]