REPORTER=dot

test:
	@node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--slow 100 \
		--bail \
		test/*.test.js

.PHONY: test
