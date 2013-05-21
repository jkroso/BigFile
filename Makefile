REPORTER=dot

test:
	@node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--slow 100 \
		test/*.test.js

.PHONY: test
