.PHONY: install run build


install:
	yarn install

run:
	./node_modules/.bin/webpack-dev-server \
		--host=0.0.0.0 \
		--colors \
		--hot

build:
	rm -rf build
	NODE_ENV=production ./node_modules/.bin/webpack \
		--progress \
		-p
