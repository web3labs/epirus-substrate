import * as ss58 from "@subsquid/ss58";
import { ResolvedContractsCallCall } from "chains/normalised-return-types";
import { ss58Format } from "../../../chain-config";
import { ContractsCallCall } from "../types/calls";

export class NormalisedContractsCallCall extends ContractsCallCall {
  resolve(): ResolvedContractsCallCall {
    if (this.isWatrNodeV1000) {
      const { dest, value, gasLimit, storageDepositLimit, data } =
        this.asWatrNodeV1000;
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
    throw new Error("No Runtime version found");
  }
}
