var fs = require('fs'),
    readSync = fs.readFileSync,
    writeSync = fs.writeFileSync,
    path = require('path'),
    resolve = path.resolve,
    should = require('chai').should(),
    assert = require('chai').assert,
    Build = require('../src/index.js'),
    spawn = require('child_process').spawn,
    Promise = require('laissez-faire')

describe('new Build(cache)', function (build) {
    beforeEach(function () {
        build = new Build()
        build.graph.addType({
            if: /\.rndom$/,
            make: function (file) {
                var location = file.path
                this.path = location
                this.base = path.dirname(location)
                this.ext = path.extname(location)
                this.name = path.basename(location, this.ext)
                this.text = file.text
                this.lastModified = file['last-modified']
                this.requires = function () {
                    return []
                }
            }
        })
    })
    it('can render a single file', function (done) {
        build
            .include(resolve(__dirname, './fixtures/simple/index.js'))
            .export('module.exports')
            .render(function(text) {
                writeSync(__dirname + '/tmp/out1.js', text)
                require('./tmp/out1.js').should.deep.equal({ simple: true})
                done()
            })
    })
    it('can define custom handlers', function(done) {
        build
            .include(resolve(__dirname, './fixtures/non_js/example.rndom'))
            .handle(/\.rndom$/, function(file) {
                return file
            })
            .render(function(txt) {
                done()
            })
    })
    it('can reassign a files path from within a handler', function(done) {
        build
            .include(resolve(__dirname, './fixtures/non_js/example.rndom'))
            .handle(/\.rndom$/, function(file) {
                file.path = file.path.replace(/(\w+)\.rndom$/, '$1.js')
                return file
            })
            .render(function(txt) {
                assert(txt.match(/\/example\.js/), 'file path not found')
                done()
            })
    })
    it('can transform text from within a handler', function (done) {
        build
            .include(resolve(__dirname, './fixtures/non_js/example.rndom'))
            .handle(/\.rndom$/, function(file) {
                file.text = 'this test is easy'
                return file
            })
            .render(function(txt) {
                assert(txt.match(/this test is easy/), 'new text not found')
                done()
            })
    })
    it('can render a optimised files', function (done) {
        build
            .include(resolve(__dirname, './fixtures/simple/has_dependency.js'))
            .export('module.exports')
            .minify({
                compress: true,
                beautify: false,
                leaveAst: false
            })
            .debug(false)
            .render(function(text) {
                writeSync(__dirname + '/tmp/out2.js', text, 'utf-8')
                require('./tmp/out2.js').should.deep.equal({
                    has_dependency: true,
                    dependency: {
                        simple: true
                    }
                })
                done()
            })
    })
    it('can load npm core modules', function (done) {
        var p = resolve(__dirname,  './fixtures/node/core/index.js')
        build.include(p)
            .graph.then(function(data) {
                Object.keys(data).should.have.a.lengthOf(3)
                data[p].text.should.equal(readSync(p, 'utf-8'))
                done()
            })
    })
    describe('CLI', function () {
        it('should compile Tip sample', function (done) {
            var temp = resolve(__dirname, './tmp/tip.js'),
                entry = resolve(__dirname, './Tip/component.json')
            spawn('bigfile', [
                '-lbp', 
                '-e', entry,
                '-w', temp,
                '-x', 'Tip'
            ]).on('exit', function () {
                var example = readSync(resolve(__dirname, './Tip/dist/Tip.js'), 'utf-8')
                temp = readSync(temp, 'utf-8')
                // Ordering varies so we compare on length
                temp.length.should.equal(example.length)
                done()
            })
        })
        it('should load custom config', function (done) {
            var entry = resolve(__dirname, './Tip/component.json'),
                output = resolve(__dirname, './tmp/custom-config.js')
            spawn('bigfile', [
                '-lb', 
                '-e', entry,
                '-w', output,
                '-x', 'module.exports'
            ], {cwd:__dirname}).on('exit', function () {
                require(output).should.equal("I\'ve been fucked with")
                done()
            })
        })
    })  
    it.skip('can watch a file', function(done) {
        var g = this.g,
                calls = 0;
        g.include(__dirname+'/tmp/placeholder.txt')
            .watch(function(err, txt) {
                calls++;
                console.log(txt);
                if(calls == 2) {
                    done();
                }
            });
        fs.writeFileSync(__dirname+'/tmp/placeholder.txt', 'This is a placeholder, so that git creates this temp directory.\n\n');
    })
})