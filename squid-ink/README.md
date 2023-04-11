# Squid Ink! project

A [Squid](https://subsquid.io) project to process [Substrate](https://substrate.io/) [pallet-contracts](https://paritytech.github.io/substrate/master/pallet_contracts/index.html) data and serve it through GraphQL with a dedicated model tailored for contracts.

It has been extended with capabilities to configure and spin up a new processor for different chains in the same project. Note that this is different from running a [multi-chain processor](https://docs.subsquid.io/recipes/running-a-squid/multi-chain-processors) as defined by Subsquid since Squid-ink stores the data model for different chains in different databases while the Subsquid multi-chain processor stores the data of all chains in the same database.

Squid-ink is using the latest Fire Squid version of Subsquid.

## Summary

- [Prerequisites](#prerequisites)
- [Deployment](#deployment)
- [Testing](#testing)
- [Development](#development)
  - [Squid Archive](#squid-archive)
  - [Adding New Chains](#adding-new-chains)
  - [Type Bundles](#types-bundle)

## Prerequisites

* node 16.x
* docker

## Deployment

### Docker Images

You can find out published the published Docker images at [Epirus Substrate registry](https://github.com/orgs/web3labs/packages?repo_name=epirus-substrate).

### Running a Server

Example `docker-compose.yml` for Rococo Canvas

```yaml
version: "3.5"

x-environment: &envs
  CHAIN: rococo
  PROCESSOR_NAME: squid-rococo
  DB_NAME: squid
  DB_HOST: db
  DB_PASS: squid
  DB_PORT: 5432
  PROCESSOR_PROMETHEUS_PORT: 3000
  GQL_PORT: 4000
  ARCHIVE_ENDPOINT: https://SQUID_ARCHIVE/graphql
  WS_ENDPOINT: wss://NODE_WSS_ENDPOINT
  BALANCES_STORE: system

services:
  db:
    image: postgres:12
    environment:
      POSTGRES_DB: squid
      POSTGRES_PASSWORD: squid

  processor:
    image: ghcr.io/web3labs/squid-ink-epirus:latest
    environment: *envs
    command: npm run processor:start
    depends_on:
      - "db"

  query:
    image: ghcr.io/web3labs/squid-ink-epirus:latest
    environment: *envs
    ports:
      - "4000:4000"
      - "3000:3000"
    depends_on:
      - "db"
      - "processor"
```

#### Bootstrapping the Database

Before you running the service you need to create the initial database model.
At this moment the migrations are not pushed neither in the git repository nor the image.


Start squid DB
```bash
sqd up
```

Generate DB schema (If it hasn't been created before)
```bash
sqd migration:generate
```

Apply DB schema
```bash
sqd migration:apply
```



## Testing
To run the unit tests, use the command

```bash
npm test
```

To generate a test coverage report, execute

```bash
npm run test:coverage
```

## Development

### Project Setup

Install Squid CLI

```bash
npm i -g @subsquid/cli@latest
```
or
```bash
brew tap subsquid/cli
brew install sqd
```

Generate data models
```bash
sqd codegen
```


### Squid Archive

The Squid processor extracts block, extrinsic and event data from a Squid Archive to perform transformation and storage. As such, a Squid Archive endpoint is always required when running the processor. Subsquid provides Archive endpoints for a myriad of Substrate chains and parachains which can be found in the [archive-registry](https://github.com/subsquid/archive-registry). If the archive registry does not contain endpoints for the chain to index, the Squid Archive can be run locally.

#### Run local Squid Archive
The `./archive` folder contains an example `docker-compose.yml` file for running a Squid archive. Multiple node websocket endpoints can be specified in the command section of the ingest service to speed up processing.

To run the archive locally

```bash
docker compose -f archive/docker-compose.yml up
```

Inspect your archive at `http://localhost:8888`. Run the processor with

```typescript
processor.setDataSource({
  archive: `http://localhost:8888/graphql`,
  chain: // your network endpoint here
});
```

To drop the archive, run
```bash
docker compose -f archive/docker-compose.yml down -v
```

### Configuring the processor for a new chain
The following steps are required when adding a new chain to the project:

#### 1. Generate TypeScript definitions for substrate events and calls
Update the `typegen.json` file to update the outDir, specVersions and typesBundle fields.

```json5
{
  "outDir": "src/chains/<your-chain-name>/types", // the directory where the type-safe wrappers are stored
  "specVersions": "http://localhost:8888/graphql", // Fire Squid archive endpoint
  "typesBundle": "<yourTypesBundle>.json", // see types bundle section below
  "events": [ // list of events to generate.
    "Balances.Transfer"
  ],
  "calls": [ // list of calls to generate
    "Contracts.call"
  ],
  "storage": [
    "System.Account" // list of storage items. To generate wrappers for all storage items, set "storage": true
  ]
}
```

Run the `squid-substrate-typegen` command (Fire Squid archive needs to be running)

```bash
npx squid-substrate-typegen typegen.json
```

#### 2. Create normalised types for your chain
Since each chain has different versions, and possibly, types, the wrappers generated in the above step is specific to the chain. We need to normalise the calls, events and storage types in order for the handlers in the processor to be able to run agnostically. An example of how type normalisation should be done can be found in the `src/chains/local` folder.

#### 3. Add chain configuration
Add the properties of your chain to the `chainConfig` object in `chain-config.ts`.

#### 4. Add .env file
A `.env` file is required per chain. It is recommended to name it as `.env.<chain-name>`. The `.env` file serves as an example.

#### 5. Run the processor


1. Build the project
```bash
npm ci
```

2. Build squid files
```bash
sqd build
```

3. Start squid DB
```bash
sqd up
```

4. Generate DB schema (If it hasn't been created before)
```bash
sqd migration:generate
```

5. Start squid process (should begin to ingest blocks)
```bash
sqd process 
```

6. To start the graphql server open the separate terminal and run
```bash
sqd serve
```

### Types bundle

Substrate chains which have blocks with metadata versions below 14 don't provide enough 
information to decode their data. For those chains external 
[type definitions](https://polkadot.js.org/docs/api/start/types.extend) are required.

Type definitions (`typesBundle`) can be given to squid tools in two forms:

1. as a name of a known chain (currently only `kusama`)
2. as a json file of a structure described below.

```json5
{
  "types": {
    "AccountId": "[u8; 32]"
  },
  "typesAlias": {
    "assets": {
      "Balance": "u64"
    }
  },
  "versions": [
    {
      "minmax": [0, 1000], // block range with inclusive boundaries
      "types": {
        "AccountId": "[u8; 16]"
      },
      "typesAlias": {
        "assets": {
          "Balance": "u32"
        }
      }
    }
  ]
}
```

* `.types` - scale type definitions similar to [polkadot.js types](https://polkadot.js.org/docs/api/start/types.extend#extension)
* `.typesAlias` - similar to [polkadot.js type aliases](https://polkadot.js.org/docs/api/start/types.extend#type-clashes)
* `.versions` - per-block range overrides/patches for above fields.

All fields in types bundle are optional and applied on top of a fixed set of well known
frame types.
