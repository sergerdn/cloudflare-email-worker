include .env
export
.DEFAULT_GOAL := wrangler_dev

wrangler_deploy:
	yarn run deploy

wrangler_dev:
	yarn run dev
