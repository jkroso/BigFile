Reporter = spec

test:
	@node_modules/.bin/mocha \
		-R $(Reporter) \
		--slow 2s \
		--globals Cookie,CookieJar,CookieAccessInfo \
		test/*.test.js

Readme.md: src/index.js docs/head.md docs/tail.md
	@cat docs/head.md > Readme.md
	@cat src/index.js | dox -a >> Readme.md
	@cat docs/tail.md >> Readme.md

.PHONY: test
