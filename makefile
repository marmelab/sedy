.PHONY: test

NODE_ENV ?= development

install-sedy:
	cd sedy && make install

install-oauth:
	cd oauth && make install

install-installer:
	cd installer && make install

install: install-sedy install-oauth install-installer
	npm install

run-sedy:
	cd sedy && make run

run-oauth:
	cd oauth && make run

run-installer:
	cd installer && make run

run:
	PM2_HOME=".pm2" ./node_modules/.bin/pm2 start ./pm2/${NODE_ENV}.json
	if test "$(NODE_ENV)" = "development"; then \
		make logs; \
	fi

logs:
	PM2_HOME=".pm2" ./node_modules/.bin/pm2 logs

status:
	PM2_HOME=".pm2" ./node_modules/.bin/pm2 status

stop:
	PM2_HOME=".pm2" ./node_modules/.bin/pm2 kill

deploy:
	cd sedy && make deploy

test:
	cd sedy && make test-unit test-e2e

publish-installer:
	cd installer && make build
	rm -rf docs/
	mv installer/build docs/
	echo "The installer is built"
	echo "You can now add and commit the docs/ files on the master branch"
