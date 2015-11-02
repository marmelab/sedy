install:
	npm install

run:
	nodemon server.js

test:
	./node_modules/.bin/mocha
.PHONY: test
