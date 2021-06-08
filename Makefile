m ?= *
docker_compose := docker-compose -f docker-compose-test.yml

.PHONY: test
test:  ## Run unit tests
	$(docker_compose) run --rm node sh -c 'cd /app && npm test -- -m "$(m)"'

.PHONY: test-setup
test-setup:  ## Start testing database and create tables
	$(docker_compose) run --rm node sh -c 'cd /app && scripts/wait-for-db.sh && npm run test:setup'

.PHONY: test-teardown
test-teardown:  ## Stop and remove testing database
	$(docker_compose) down

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'
