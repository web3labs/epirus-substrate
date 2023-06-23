how to run the ui service?
1. create a docker-compose.yml with the following contents:
```
version: "3.5"

services:
  explorer-ui:
    container_name: explorer-ui
    image: ghcr.io/web3labs/epirus-substrate-ui:latest
    environment:
      - REACT_APP_SQUID_ENDPOINT=https://substrate.sirato.xyz/squid/graphql
      - REACT_APP_SQUID_ARCHIVE_ENDPOINT=https://substrate.sirato.xyz:4445/graphql
      - REACT_APP_SOURCE_CODE_ENABLED=true
      - REACT_APP_VERIFIER_ENDPOINT=https://ink-verifier.sirato.xyz/api
      - REACT_APP_VERIFIER_WS_ENDPOINT=wss://ink-verifier.sirato.xyz/api
    ports:
      - "8080:80"
```
2. start the ui container with `docker-compose up -d`
3. navigate to `http://localhost:8080`
4. click on the `Blocks` menu item to show list of latest blocks:
![blocks list](https://drive.google.com/file/d/1T7t5MYVio1wO3eT10OT0hjwO55RCBZVt/view?usp=sharing)
5. click on any block height link to show that block data:
![block data](https://drive.google.com/file/d/1XynoH-BqCmEzG3rIbDrg4RF0r7lWHFQw/view?usp=sharing)
5. click on any extrinsic id link to show that extrinsic data:
![extrinsic data](https://drive.google.com/file/d/1T7t5MYVio1wO3eT10OT0hjwO55RCBZVt/view)
