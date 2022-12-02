#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")"

docker-compose \
-f docker-compose.testnet.yml \
-f docker-compose.squid-archive.yml \
-f docker-compose.squid-ink.yml \
-f docker-compose.explorer-ui.yml \
pull && \
docker-compose \
-f docker-compose.testnet.yml \
-f docker-compose.squid-archive.yml \
-f docker-compose.squid-ink.yml \
-f docker-compose.explorer-ui.yml \
up
