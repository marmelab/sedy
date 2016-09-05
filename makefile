.PHONY: test install-lambda install

## Generic
install: install-lambda

clean: clean-lambda

build: build-lambda

test: test-lambda

deploy: deploy-lambda

## Lambda management
install-lambda:
	@cd ./app/lambda && npm install

clean-lambda:
	@rm -rf build/lambda/*

build-lambda: clean-lambda
	@cd ./app/lambda && ./node_modules/.bin/webpack --progress

deploy-lambda: clean-lambda
	@cd ./app/lambda && ./node_modules/.bin/webpack -p --progress --optimize-dedupe
	@cd ./build/lambda && zip -r sedy.zip *
	@aws lambda update-function-code --function-name Sedy --zip-file fileb://build/lambda/sedy.zip

test-lambda:
	@cd ./app/lambda && ./node_modules/.bin/mocha \
		--compilers js:babel-core/register \
		--require babel-polyfill \
		--require co-mocha \
		--recursive \
			./src/*.spec.js \
			'./src/**/*.spec.js'
