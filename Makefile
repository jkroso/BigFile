Reporter = spec

test:
	@node_modules/.bin/mocha \
		--reporter $(Reporter) \
		--slow 2s \
		--globals Cookie,CookieJar,CookieAccessInfo \
		test/*.test.js

.PHONY: test
