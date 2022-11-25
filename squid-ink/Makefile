process: migrate
	@node -r dotenv/config lib/processor.js


serve:
	@npx squid-graphql-server


migrate:
	@npx sqd db:migrate


migration:
	@npx sqd db:create-migration Data


build:
	@npm run build


codegen:
	@npx sqd codegen


typegen: rococoContractsVersions.json
	@npx squid-substrate-typegen typegen.json


rococoContractsVersions.json:
	@make explore


explore:
	@npx squid-substrate-metadata-explorer \
			--chain wss://suba.epirus.io/node \
			--archive https://suba.epirus.io/archive/graphql \
			--out rococoContractsVersions.json


up:
	@docker-compose up -d


down:
	@docker-compose down


.PHONY: process serve start codegen migration migrate up down
