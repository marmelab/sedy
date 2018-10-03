

copy-conf: ## Initialize the configuration files by copying the *''-dist" versions (does not override existing config)
	-cp -n ./config/production-dist.json ./config/production.json

install: copy-conf
	yarn install

clean:
	rm -rf build/*

build: clean
	./node_modules/.bin/webpack --progress -p

run:
	./node_modules/.bin/nodemon \
		--require @babel/polyfill \
		--require @babel/register \
		./src/server.js

deploy: clean
	./node_modules/.bin/webpack -p --progress
	cd build && zip -r sedy.zip *
	aws lambda update-function-code --function-name Sedy --zip-file fileb://build/sedy.zip

test-unit:
	./node_modules/.bin/mocha \
		--require @babel/polyfill \
		--require @babel/register \
		--require co-mocha \
		--recursive \
			./src/*.spec.js \
			'./src/**/*.spec.js'

test-e2e:
	./node_modules/.bin/mocha \
		--require @babel/polyfill \
		--require @babel/register \
		--require co-mocha \
		--recursive \
			./e2e/*.spec.js \
			'./e2e/**/*.spec.js'
