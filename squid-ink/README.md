# Squid Ink! project

A [Squid](https://subsquid.io) project to process [Substrate](https://substrate.io/) [pallet-contracts](https://paritytech.github.io/substrate/master/pallet_contracts/index.html) data and serve it through GraphQL with a dedicated model tailored for contracts.

It has been extended with capabilities to configure and spin up a new processor for different chains in the same project. Note that this is different from running a [multi-chain processor](https://docs.subsquid.io/recipes/running-a-squid/multi-chain-processors) as defined by Subsquid since Squid-ink stores the data model for different chains in different databases while the Subsquid multi-chain processor stores the data of all chains in the same database.

## Summary

- [Project setup](#project-setup)
- [Squid Archive](#squid-archive)
- [Configuring the processor for a new chain](#configuring-the-processor-for-a-new-chain)
- [Type Bundles](#types-bundle)

## Prerequisites

* node 16.x
* docker

## Project setup

```bash
# Install dependencies
npm ci

# Generate data models
npx sqd codegen
```

## Squid Archive
The Squid processor extracts block, extrinsic and event data from a Squid Archive to perform transformation and storage. As such, a Squid Archive endpoint is always required when running the processor. Subsquid provides Archive endpoints for a myriad of Substrate chains and parachains which can be found in the [archive-registry](https://github.com/subsquid/archive-registry). If the archive registry does not contain endpoints for the chain to index, the Squid Archive can be run locally.

### Run local Squid Archive
Inspect `archive/.env` and provide the websocket endpoint for your node. If the network requires custom type bundles (for older versions of Substrate), mount them as volumes in `archive/docker-compose.yml` and uncomment the relevant sections in `archive/.env`.

**Note:** When running a chain with EVM pallet, the indexer and indexer-gateway images should be changed to `subsquid/hydra-evm-indexer:5` and `subsquid/hydra-evm-indexer-gateway:5` respectively.

Then run (in a separate terminal window)

```bash
docker compose -f archive/docker-compose.yml up
```

Inspect your archive at `http://localhost:4010/console`. Run the processor with

```typescript
processor.setDataSource({
  archive: `http://localhost:4010/v1/graphql`,
  chain: // your network endpoint here
});
```

To drop the archive, run
```bash
docker compose -f archive/docker-compose.yml down -v
```

## Configuring the processor for a new chain
The following steps are required when adding a new chain to the project:

### 1. Generate TypeScript definitions for substrate events and calls
Generation of type-safe wrappers for events, calls and storage items is currently a two-step process.

First, you need to explore the chain to find blocks which introduce new spec version and
fetch corresponding metadata. 

```bash
npx squid-substrate-metadata-explorer \
  --chain wss://kusama-rpc.polkadot.io \
  --archive https://kusama.indexer.gc.subsquid.io/v4/graphql \
  --out kusamaVersions.json
```

In the above command `--archive` parameter is optional, but it speeds up the process
significantly. From scratch exploration of kusama network without archive takes 20-30 minutes.

Pass the result of previous exploration to `--out` parameter. In that case exploration will
start from the last known block and thus will take much less time.

After chain exploration is complete, we move on to the next step which is to generate 
required wrappers. Update the `typegen.json` file to update the outDir, chainVersions and typesBundle fields.

```json5
{
  "outDir": "src/chains/<your-chain-name>/types", // the directory where the type-safe wrappers are stored
  "chainVersions": "<yourChainVersions>.json", // the result of chain exploration
  "typesBundle": "<yourTypesBundle>.json", // see types bundle section below
  "events": [ // list of events to generate.
    "balances.Transfer"
  ],
  "calls": [ // list of calls to generate
    "timestamp.set"
  ],
  "storage": [
    "System.Account" // list of storage items. To generate wrappers for all storage items, set "storage": true
  ]
}
```

Run the `squid-substrate-typegen` command

```bash
npx squid-substrate-typegen typegen.json
```

### 2. Create normalised types for your chain
Since each chain has different versions, and possibly, types, the wrappers generated in the above step is specific to the chain. We need to normalise the calls, events and storage types in order for the handlers in the processor to be able to run agnostically. An example of how type normalisation should be done can be found in the `src/chains/local` folder.

### 3. Add chain configuration
Add the properties of your chain to the `chainConfig` object in `chain-config.ts`.

### 4. Add .env file
A `.env` file is required per chain. It is recommended to name it as `.env.<chain-name>`. The `.env` file serves as an example.

### 5. Run the processor

```bash
# 1. Compile typescript files
npm run build

# 2. Start target Postgres database (use -d to run in background)
docker compose up

# 3.1. If it's the first time running, create the database first
npx sqd db create
npx sqd db migrate

#3.2 For subsequent runs, if a clean db is needed, use the script
npm run schema:reset

# 5. Now start the processor
ENV=/path/to/.env npm run processor:start

# 6. The above command will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
npx squid-graphql-server
```

## Types bundle

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
