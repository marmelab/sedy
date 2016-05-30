.PHONY: test

install:
	@npm install

clean:
	@rm -rf build/*

build: clean
	@./node_modules/.bin/webpack --progress

deploy: build
	@NODE_ENV=production ./node_modules/.bin/webpack -p --progress --optimize-dedupe
	@cd build && zip -r sedy.zip *
	@aws lambda update-function-code --function-name Sedy --zip-file fileb://build/sedy.zip

test:
	@./node_modules/.bin/mocha --compilers js:babel-core/register --require babel-polyfill --require co-mocha --recursive ./src/**/*.spec.js
