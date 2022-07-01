import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import {
  ResolvedContractsCallCall,
  ResolvedContractsSetCodeCall,
} from "chains/normalised-return-types";
import { ss58Format } from "../../../chain-config";
import { ContractsCallCall, ContractsSetCodeCall } from "../types/calls";

export class NormalisedContractsCallCall extends ContractsCallCall {
  resolve(): ResolvedContractsCallCall {
    if (this.isV16) {
      const { dest, value, gasLimit, storageDepositLimit, data } = this.asV16;
      // TODO: Ensure proper support of MultiAddress
      if (dest.__kind === "Index") {
        throw new Error("Multi-address of type Index is not supported!");
      }
      return {
        contractAddress: ss58.codec(ss58Format).encode(dest.value),
        value,
        gasLimit,
        storageDepositLimit,
        data,
      };
    }
    throw new Error(
      "No Runtime version found while decoding [ContractsCallCall]"
    );
  }
}

export class NormalisedContractsSetCodeCall extends ContractsSetCodeCall {
  resolve(): ResolvedContractsSetCodeCall {
    if (this.isV9220) {
      const { dest, codeHash } = this.asV9220;
      // TODO: Ensure proper support of MultiAddress
      if (dest.__kind === "Index") {
        throw new Error("Multi-address of type Index is not supported!");
      }
      return {
        contractAddress: ss58.codec(ss58Format).encode(dest.value),
        codeHash: toHex(codeHash),
      };
    }
    throw new Error(
      "No Runtime version found while decoding [ContractsSetCodeCall]"
    );
  }
}
