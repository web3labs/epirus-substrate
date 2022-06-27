import assert from "assert";
import * as ss58 from "@subsquid/ss58";
import { decodeHex } from "@subsquid/util-internal-hex";
import {
  BalancesAccountStorage,
  ContractsCodeStorageStorage,
  ContractsContractInfoOfStorage,
  ContractsOwnerInfoOfStorage,
  SystemAccountStorage,
} from "../types/storage";
import { AccountData, AccountInfoWithTripleRefCount } from "../types/v1";
import { ss58Format } from "../../../chain-config";
import { OwnerInfo, PrefabWasmModule, RawContractInfo } from "../types/v31";

export class NormalisedSystemAccountStorage extends SystemAccountStorage {
  async get(accountId: string): Promise<AccountInfoWithTripleRefCount> {
    assert(this.isExists);
    if (this.isV1) {
      return this.getAsV1(ss58.codec(ss58Format).decode(accountId));
    }
    throw new Error("No Runtime version found");
  }
}

export class NormalisedBalancesAccountStorage extends BalancesAccountStorage {
  async get(accountId: string): Promise<AccountData> {
    assert(this.isExists);
    if (this.isV1) {
      return this.getAsV1(ss58.codec(ss58Format).decode(accountId));
    }
    throw new Error("No Runtime version found");
  }
}

export class NormalisedContractInfoOfStorage extends ContractsContractInfoOfStorage {
  async get(accountId: string): Promise<RawContractInfo> {
    assert(this.isExists);
    let info: RawContractInfo | undefined;
    if (this.isV31) {
      info = await this.getAsV31(ss58.codec(ss58Format).decode(accountId));
    } else {
      throw new Error("No Runtime version found");
    }
    if (info) {
      return info;
    }
    throw new Error(
      `ContractInfoOf not found in storage for accountId [${accountId}]`
    );
  }
}

export class NormalisedCodeStorageStorage extends ContractsCodeStorageStorage {
  async get(key: string): Promise<PrefabWasmModule> {
    assert(this.isExists);
    let info: PrefabWasmModule | undefined;
    if (this.isV31) {
      info = await this.getAsV31(decodeHex(key));
    } else {
      throw new Error("No Runtime version found");
    }
    if (info) {
      return info;
    }
    throw new Error(`CodeStorage not found in storage for key [${key}]`);
  }
}

export class NormalisedOwnerInfoOfStorage extends ContractsOwnerInfoOfStorage {
  async get(key: string): Promise<OwnerInfo> {
    assert(this.isExists);
    let info: OwnerInfo | undefined;
    if (this.isV31) {
      info = await this.getAsV31(decodeHex(key));
    } else {
      throw new Error("No Runtime version found");
    }
    if (info) {
      return info;
    }
    throw new Error(`CodeStorage not found in storage for key [${key}]`);
  }
}