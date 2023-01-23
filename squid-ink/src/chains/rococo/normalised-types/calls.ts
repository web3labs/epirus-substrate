import * as ss58 from "@subsquid/ss58";
import { ResolvedContractsCallCall } from "chains/normalised-return-types";
import { ss58Format } from "../../../chain-config";
import { ContractsCallCall } from "../types/calls";

export class NormalisedContractsCallCall extends ContractsCallCall {
  resolve(): ResolvedContractsCallCall {
    if (this.isV9321) {
      const { dest, value, gasLimit, storageDepositLimit, data } = this.asV9321;
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
    if (this.isCanvasKusamaV16) {
      const { dest, value, gasLimit, storageDepositLimit, data } =
        this.asCanvasKusamaV16;
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
    if (this.isV9290) {
      const { dest, value, gasLimit, storageDepositLimit, data } = this.asV9290;
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
    throw new Error(
      "No Runtime version found while decoding [ContractsCallCall]"
    );
  }
}
