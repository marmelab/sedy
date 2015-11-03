install:
	npm install

run:
	nodemon server.js

test:
	./node_modules/.bin/mocha --require=co-mocha --harmony
.PHONY: test
