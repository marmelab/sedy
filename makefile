.PHONY: test install-lambda install

## Generic
install: install-lambda install-installer

clean: clean-lambda clean-installer

build: build-lambda build-installer

test: test-lambda test-installer

deploy: deploy-lambda deploy-installer

run: run-installer

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

# Installer management
install-installer:
	@cd ./app/installer && npm install

clean-installer:
	@rm -rf build/installer/*

build-installer: clean-installer
	@cd ./app/installer && ./node_modules/.bin/webpack --progress

deploy-installer: clean-installer
	echo 'Deployment script todo'

test-installer-unit:
	@cd ./app/installer && NODE_ENV=test ./node_modules/.bin/mocha \
		--compilers="css:./webpack/null-compiler,js:babel-core/register" \
		"./src/js/**/*.spec.js"

test-installer-functional:
	echo 'Functional tests todo'

test-installer:
	@cd ./app/installer && cp -n ./config/test-dist.js ./config/test.js | true
	@make test-installer-unit
	@make test-installer-functional

run-installer:
	@cd ./app/installer && ./node_modules/.bin/webpack-dev-server \
		--no-info \
		--colors \
		--devtool cheap-module-inline-source-map \
		--hot \
		--inline
