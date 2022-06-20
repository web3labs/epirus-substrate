import * as ss58 from "@subsquid/ss58";
import { ResolvedContractsCallCall } from "chains/normalised-return-types";
import { ss58Format } from "../../../chain-config";
import { ContractsCallCall } from "../types/calls";

export class NormalisedContractsCallCall extends ContractsCallCall {
  resolve(): ResolvedContractsCallCall {
    if (this.isV31) {
      const { dest } = this.asV31;
      // TODO: Ensure proper support of MultiAddress
      if (dest.__kind === "Index") {
        throw new Error("Multi-address of type Index is not supported!");
      }
      return {
        contractAddress: ss58.codec(ss58Format).encode(dest.value),
      };
    }
    throw new Error("No Runtime version found");
  }
}
