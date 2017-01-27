.PHONY: install run build


install:
	npm install

run:
	NODE_ENV=development ./node_modules/.bin/webpack-dev-server \
		--host=0.0.0.0 \
		--colors \
		--hot

build:
	rm -rf build
	NODE_ENV=production ./node_modules/.bin/webpack \
		--progress \
		-p
