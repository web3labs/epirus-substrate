> We are using this patched version of @subsquid/ink-abi until there is official support for ink! v4.
> 
> See https://github.com/subsquid/squid-sdk/issues/149 for more info
 
# @subsquid/ink-abi

Provides decoding functions for [ink!](https://ink.substrate.io) events, messages and constructors.

## Usage

```typescript
import {Abi} from "@subsquid/ink-abi"

const abi = new Abi(abi_json)
const args = abi.decodeConstructor('0x9bae9d5e0000a0dec5adc9353600000000000000')
assert(args.initialSupply == 1000000000000000000000n)
```
