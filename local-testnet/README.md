# Local Testnet

This project runs all the Epirus Substrate components in a local environment.

Includes:
- Substrate test network nodes with contracts support and block finality[^1]
- Squid archive connected to the test network
- Squid contracts indexer and GraphQL API connected to the archive
- The explorer UI web application

[^1]: The current implementation of instant-seal mode does not finalize blocks. See [Issue #102](https://github.com/paritytech/subport/issues/102) for discussion and workarounds.

## Running

Execute

```bash
./run-all.sh
```
After a successful run

* The UI is served at http://localhost/
* The testnet WS endpoint listens at ws://localhost:9944 and can be used with [Polkadot/Substrate Portal](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer) and [Substrate Contracts UI](https://contracts-ui.substrate.io/?rpc=ws://127.0.0.1:9944).

