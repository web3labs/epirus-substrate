# Local Testnet

This project runs all the Epirus Substrate components in a local environment.

Includes:
- Substrate test network nodes with contracts support and block finality[^1]
- Squid archive connected to the test network
- Squid contracts indexer and GraphQL API connected to the archive
- The explorer UI web application

[^1]: The current implementation of instant-seal mode does not finalize blocks. See [Issue #102](https://github.com/paritytech/subport/issues/102) for discussion and workarounds.

## Running

```bash
./run-all.sh
```

The UI will be served at http://localhost/

