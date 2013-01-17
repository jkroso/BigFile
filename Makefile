Reporter = dot

install: 
	@npm install

colony:
	@node_modules/.bin/colony src/index.js -r Readme.md -s 2

test:
	@node_modules/.bin/mocha -R $(Reporter) --slow 2s -t 10s test/*.test.js

debug:
	@node_modules/.bin/mocha debug -R $(Reporter) -t 3000s test/build.test.js

inspect:
	@node_modules/.bin/mocha --debug-brk -R $(Reporter) -t 3000s test/build.test.js

Readme.md: src/index.js docs/head.md docs/tail.md
	@cat docs/head.md > Readme.md
	@cat src/index.js | dox -a >> Readme.md
	@cat docs/tail.md >> Readme.md

.PHONY: test clean build all build-test colony