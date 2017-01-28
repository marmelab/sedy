.PHONY: test

install-sedy:
	cd sedy && make install

run-sedy:
	cd sedy && make run

run-installer:
	cd installer && make run

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
