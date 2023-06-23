# How to run the UI service and view blocks data?

**Table of Contents**

- [**Prerequisites**](#prerequisites)
- [**Launching the UI app**](#launching-the-ui-app)
- [**Exploring blocks data**](#exploring-blocks-data)

### **Prerequisites**

You will need the following software installed in your machine:
- Docker >= 20.10.21
- Docker Compose >= 1.29.2

### **Launching the UI app**

1. Create a `docker-compose.yml` with the following contents in some directory:
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
2. Start the UI container by running this command from the directory where you created the above file:
```
> docker-compose up -d`
```

### **Exploring blocks data**

You can now navigate to `http://localhost:8080` and start browsing the blocks data.

Click on the `Blocks` menu item to show list of latest blocks:

![blocks list](https://drive.google.com/uc?export=view&id=1XynoH-BqCmEzG3rIbDrg4RF0r7lWHFQw)

Click on any block height link to show that block data on the above page:

![block data](https://drive.google.com/uc?export=view&id=1l7x8Q5Pmlzl7ZxS2d_LrKNmNFCm5m539)

Click on any extrinsic id link to show that extrinsic data on the above page:

![extrinsic data](https://drive.google.com/uc?export=view&id=1T7t5MYVio1wO3eT10OT0hjwO55RCBZVt)
