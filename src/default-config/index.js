module.exports = {
	resolveTime: {
		fileTypes: require('./resolveTime/types'),
		lookup: {
			hash: require('./resolveTime/resolvers/hash'),
			file: require('./resolveTime/resolvers/filesystem')
		}
	},
	compileTime: {
		excludes: require('./compileTime/exclude'),
		handlers: require('./compileTime/handlers')
	}
}