import * as ss58 from "@subsquid/ss58";
import { ResolvedContractsCallCall } from "chains/normalised-return-types";
import { ss58Format } from "../../../chain-config";
import { ContractsCallCall } from "../types/calls";
import { MultiAddress } from "../types/v20";
import * as v45 from "../types/v45";

export class NormalisedContractsCallCall extends ContractsCallCall {
  resolve(): ResolvedContractsCallCall {
    if (this.isV20) {
      const { dest, value, gasLimit, storageDepositLimit, data } = this.asV20 as {
        dest: MultiAddress,
        value: bigint;
        gasLimit: bigint;
        storageDepositLimit: bigint | undefined;
        data: Uint8Array;
      };
      // TODO: Ensure proper support of MultiAddress
      if (dest.__kind === "Index") {
        throw new Error("Multi-address of type Index is not supported!");
      }
      return {
        contractAddress: ss58.codec(ss58Format).encode(dest.value),
        value,
        gasLimit: {
          refTime: gasLimit,
        },
        storageDepositLimit,
        data,
      };
    }
    if (this.isV45) {
      const { dest, value, gasLimit, storageDepositLimit, data } = this.asV45 as {
        dest: v45.MultiAddress,
        value: bigint;
        gasLimit: v45.Weight;
        storageDepositLimit: bigint | undefined;
        data: Uint8Array;
      };

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
    throw new Error("No Runtime version found");
  }
}
