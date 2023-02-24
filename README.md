# Epirus Substrate Explorer

![GitHub last commit](https://img.shields.io/github/last-commit/web3labs/epirus-substrate) ![GitHub repo size](https://img.shields.io/github/repo-size/web3labs/epirus-substrate)

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

## Public Services[^note]

![Epirus UI](https://img.shields.io/website?label=Epirus%20UI&url=https%3A%2F%2Fepirus-sub.netlify.app%2F) ![Squid Ink API](https://img.shields.io/website?label=Squid%20Ink%20API&url=https%3A%2F%2Fsuba.epirus.io%2Fsquid%2Fgraphql)

1. We host a public Squid Ink GraphQL endpoint for Rococo Canvas at [https://suba.epirus.io/squid/graphql](https://suba.epirus.io/squid/graphql)
2. A development instance of the Explorer UI [https://substrate.sirato.xyz/](https://substrate.sirato.xyz/)

[^note]: Provided "as is" without any availability guarantee.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) as it is our base for interaction.

## License

This project is licensed under the [Apache LICENSE](LICENSE).

## Others

### Local Development Network

You can find a repository with a Substrate network configuration and archive node for development at [dev-contracts-substrate](https://github.com/web3labs/dev-contracts-substrate).

### Source Code Verification

We have a source code verification service for ink! contracts in the [ink-verifier-server](https://github.com/web3labs/ink-verifier-server) repository. You can also find instructions on how to verify ink! contracts in our [tutorial](https://github.com/web3labs/ink-verifier-server/blob/main/docs/TUTORIAL.md)

---

💫🪐✨💿

Have fun!
