run:
	node --require babel-polyfill --require babel-core/register ./src/server.js

install:
	npm install

clean:
	rm -rf build/*

deploy: clean
	./node_modules/.bin/webpack -p --progress --optimize-dedupe
	cd build && zip -r oauth.zip *
	aws lambda update-function-code --function-name SedyOauth --zip-file fileb://build/oauth.zip
