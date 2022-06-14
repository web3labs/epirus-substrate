#!/usr/bin/env bash

set -eu

CWD=$(dirname -- "$( readlink -f -- "$0"; )")
cd $CWD/../target/release

./node-template purge-chain --base-path /tmp/alice --chain local -y
./node-template purge-chain --base-path /tmp/bob --chain local -y