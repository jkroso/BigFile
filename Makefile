REPORTER=dot

test: node_modules
	@node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--slow 100 \
		--bail \
		test/*.test.js

node_modules: package.json
	@npm i
	@touch node_modules

.PHONY: test
