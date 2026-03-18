.DEFAULT_GOAL := help
.PHONY: build clean help

build: ## Generate static web site
	hugo --buildFuture --config config.toml --destination public -v

deploy:
	s3cmd --access_key=$(AWS_ACCESS_KEY_ID) --secret_key=$(AWS_SECRET_ACCESS_KEY) --region=$(AWS_REGION) put --acl-public --guess-mime-type --no-mime-magic FILE public/css/main-$(CSS_VERSION).css s3://www.skycoin.com/blog/css/ && s3cmd --access_key=$(AWS_ACCESS_KEY_ID) --secret_key=$(AWS_SECRET_ACCESS_KEY) --region=ap-southeast-1 sync --acl-public --delete-removed --guess-mime-type --no-mime-magic --recursive public/ s3://$(AWS_BUCKET)/

clean: ## Remove static web site files
	rm -r public/*

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
