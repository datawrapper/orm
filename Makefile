export DW_CONFIG_PATH ?= tests/config.docker.js
m ?= *

docker_compose := docker-compose -f docker-compose-test.yml

.PHONY: test
test:  ## Run unit tests (create the testing database if it isn't running)
	[[ -n $$($(docker_compose) ps --services --filter status=running mysql) ]] || \
		$(MAKE) test-shell cmd='cd /app && script/wait-for-db.sh && node script/sync-db.js'
	$(MAKE) test-shell cmd='cd /app && npm test -- -m "$(m)"'

.PHONY: test-teardown
test-teardown:  ## Stop and remove the testing database
	$(docker_compose) down

.PHONY: test-shell
test-shell:  ## Run command specified by the variable 'cmd' in a shell in the testing node container
	$(docker_compose) run --rm -e "DW_CONFIG_PATH=$(DW_CONFIG_PATH)" node sh -c '$(cmd)'

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'
