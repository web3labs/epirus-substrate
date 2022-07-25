# Epirus Substrate Explorer

Blockchain explorer for Substrate chains with a focus on the [contracts pallet](https://github.com/paritytech/substrate/tree/master/frame/contracts) and [ink!](https://ink.substrate.io/)

## Overview

The system presents two main subsystems:

**1. [Explorer UI](explorer-ui/)**

The explorer UI provides a user-friendly application to interact with the Squid Ink GraphQL API.

**2. [Squid Ink](squid-ink/)**

The Squid transforms data from a [Squid Archive](https://docs.subsquid.io/docs/archives/how-to-launch-a-squid-archive), stores it and exposes a GraphQL API for the UI.

## Deployment

There are three different components that need to be run in order:
1. Subsquid Archive
2. Squid-ink
3. Explorer UI

### Subsquid Archive
There is an example `docker-compose.yml` file found in `squid-ink/archive` folder. It is configured to connect to our Rococo-contracts archive node.

To run the archive locally:
```bash
# From project root
docker-compose -f squid-ink/archive/docker-compose.yml up
```

### Squid-ink
[Squid-ink deployment](./squid-ink/README.md#deployment)

### Explorer UI
```bash
cd explorer-ui/
npm run start
```

[UI configuration](./explorer-ui/README.md#configuration)

## Others

### Local Development Network

You can find a repository with a Substrate network configuration and archive node for development at [dev-contracts-substrate](https://github.com/web3labs/dev-contracts-substrate).

---

💫🪐✨💿

Have fun!
