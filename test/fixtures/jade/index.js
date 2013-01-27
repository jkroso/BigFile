var tmpl = require('./tmpl.jade')

exports.fn = tmpl

exports.text = tmpl({
	users: [
		{
			id:1,
			name:'uno'
		}
	]
})