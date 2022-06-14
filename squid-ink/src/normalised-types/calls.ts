import * as ss58 from "@subsquid/ss58";
import { ContractsCallCall } from "../types/calls";

export class NormalisedContractsCallCall extends ContractsCallCall {
  resolve(): {
    contractAddress: string;
    value?: bigint;
    gasLimit?: bigint;
    storageDepositLimit?: bigint | undefined;
    data?: Uint8Array;
  } {
    if (this.isV100) {
      const { dest } = this.asV100;
      // TODO: Ensure proper support of MultiAddress
      if (dest.__kind === "Index") {
        throw new Error("Multi-address of type Index is not supported!");
      }
      return { contractAddress: ss58.codec("substrate").encode(dest.value) };
    }
    throw new Error("No Runtime version found");
  }
}
