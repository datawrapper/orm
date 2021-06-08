m ?= *

.PHONY: test
test:
	docker-compose -f docker-compose-test.yml run --rm node \
		sh -c 'cd /app && npm run test:docker -- -m "$m"'
