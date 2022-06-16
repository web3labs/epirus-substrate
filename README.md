# Epirus Substrate Explorer

Epirus explorer for Substrate chains that supports ink! smart contracts.

## Project Set Up

### Substrate
#### Contracts Node Network
See [dev-contracts-substrate](https://github.com/web3labs/dev-contracts-substrate).

### Squid Ink
The squid-ink project contains 2 components: the Archive and the Squid. 

#### Archive
A Squid Archive indexes the chain and provides information about blocks, extrinsics and events through a GraphQL API.

#### Squid
A Squid is a processor that transforms the data from the archive to a GraphQL schema that can be used easiily by the front.

### Explorer UI
The front-end for the explorer.
