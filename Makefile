default:
	npm run start:dev

docker:
	docker-compose --file docker-compose-dev.yml up
