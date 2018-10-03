.PHONY: test

NODE_ENV ?= development

install-sedy:
	make -C sedy install

install: install-sedy
	yarn install

run-sedy:
	cd sedy && make run

deploy:
	cd sedy && NODE_ENV=production make deploy

test:
	cd sedy && make test-unit test-e2e
