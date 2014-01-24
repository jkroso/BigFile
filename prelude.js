(function(modules){
  var cache = {}

  for (var i = 0; i < modules.length;) {
    var id = modules[i++]
    var fn = modules[i++]
    var deps = modules[i++]
    cache[id] = {
      exports: {},
      deps: deps,
      fn: fn
    }
  }

  function require(dep, parent){
    var deps = cache[parent].deps
    var id = deps[dep]
    if (id in cache) return load(id)
    throw new Error(''
      + 'unable to require ' + dep + ' from ' + parent + '\n'
      + 'Available deps are:\n' + Object.keys(deps).join('\n  '))
  }

  function load(id){
    var m = cache[id]
    if (!m.loaded) {
      m.loaded = true
      m.fn.call(m.exports, m, m.exports, function(path){
        return require(path, id)
      })
    }
    return m.exports
  }

  return load
})
