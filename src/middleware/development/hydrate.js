
/**
 * give each file an identity
 */

for (var file in modules) {
	modules[file] = {
		source: modules[file],
		loaded: false,
		exports: {}
	}
}

/**
 * add aliases to the module map
 */

for (var alias in aliases) {
	if (alias in modules) continue
	modules[alias] = modules[aliases[alias]] 
}
