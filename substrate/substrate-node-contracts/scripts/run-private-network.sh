#!/usr/bin/env bash

set -eu

CWD=$(dirname -- "$( readlink -f -- "$0"; )")
cd $CWD/../target/release

alice() {
  ./node-template \
  --base-path /tmp/alice \
  --chain local \
  --alice \
  --port 30333 \
  --unsafe-rpc-external --unsafe-ws-external --rpc-cors all \
  --node-key 0000000000000000000000000000000000000000000000000000000000000001 \
  --validator --pruning archive &
}

bob() {
  ./node-template \
  --base-path /tmp/bob \
  --chain local \
  --bob \
  --port 30334 \
  --ws-port 9946 \
  --rpc-port 9934 \
  --validator --pruning archive \
  --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/${1}
}

ALICE_ID=$(alice 2>&1 | grep -m 1 -oP  'Local node identity is: \K[\w\W]+(?=$)')

echo "ALICE ID: $ALICE_ID"

bob $ALICE_ID

exit 0
