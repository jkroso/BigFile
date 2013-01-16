var falafel = require('falafel')

module.exports = function (files, next) {
	var self = this
	var hash = {}, entry
	files.forEach(function (file, i) {
		file.index = i
		if (file.path === self._entry) entry = i
		file.text = minify(file.text, self._min_options)
		hash[file.path] = file
	})
	files = files.map(function (file) {
		return falafel(file.text, function (node) {
			if (isRequire(node)) {
				var name = node.arguments[0].value
				var path = self.graph.resolveInternal(file.base, name)
				if (!path) throw new Error(name+' is needed for a production build')
				if (!hash[path]) throw new Error(name+' should not of resolved to '+path)
				node.update('require('+hash[path].index+')')
			}
		}).toString()
	})
	return [
		'!function(){',
		readSync(join(__dirname, '../src/require.production.js'), 'utf-8'),
		'var modules = ' + JSON.stringify(files),
		(self._export ? self._export+' = ' : '') + 'require('+entry+')',
		'}()'
	].join('\n')

	function isRequire (node) {
		return node.type === 'CallExpression'
			&& (node = node.callee).type === 'Identifier'
			&& node.name === 'require'
	}
}