# Epirus Substrate Explorer

Blockchain explorer for Substrate chains with a focus on the [contracts pallet](https://github.com/paritytech/substrate/tree/master/frame/contracts) and [ink!](https://ink.substrate.io/)

## Overview

The system presents two main components:

**1. [Explorer UI](explorer-ui/)**

The explorer UI provides a user-friendly application to interact with the Squid Ink GraphQL API.

**2. [Squid Ink](squid-ink/)**

The Squid transforms data from a [Squid Archive](https://docs.subsquid.io/docs/archives/how-to-launch-a-squid-archive), stores it and exposes a GraphQL API for the UI.

## Deployment

We are publishing docker images of every service needed to run the full system.

You can find examples of docker compose configurations in the [local-testnet](https://github.com/web3labs/epirus-substrate/tree/main/local-testnet) folder.

## Others

### Public Services[^note]

1. We host a public Squid Ink GraphQL endpoint for Rococo Canvas at [https://suba.epirus.io/squid/graphql](https://suba.epirus.io/squid/graphql)
2. A development instance of the Explorer UI [https://epirus-sub.netlify.app/](https://epirus-sub.netlify.app/)

[^note]: Provided "as is" without any availability guarantee.

### Local Development Network

You can find a repository with a Substrate network configuration and archive node for development at [dev-contracts-substrate](https://github.com/web3labs/dev-contracts-substrate).

---

💫🪐✨💿

Have fun!
