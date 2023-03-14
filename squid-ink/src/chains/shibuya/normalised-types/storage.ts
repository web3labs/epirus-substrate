import assert from "assert";
import * as ss58 from "@subsquid/ss58";
import { decodeHex } from "@subsquid/util-internal-hex";
import { ResolvedContractInfoOfStorage } from "chains/normalised-return-types";
import {
  BalancesAccountStorage,
  ContractsCodeStorageStorage,
  ContractsContractInfoOfStorage,
  ContractsOwnerInfoOfStorage,
  SystemAccountStorage,
} from "../types/storage";
import { AccountData, AccountInfo } from "../types/v1";
import { ss58Format } from "../../../chain-config";
import { OwnerInfo, PrefabWasmModule } from "../types/v31";

export class NormalisedSystemAccountStorage extends SystemAccountStorage {
  async get(accountId: string): Promise<AccountInfo> {
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
  async get(accountId: string): Promise<ResolvedContractInfoOfStorage> {
    assert(this.isExists);
    let info: ResolvedContractInfoOfStorage | undefined;
    const contractAccount = ss58.codec(ss58Format).decode(accountId);
    if (this.isV31) {
      info = await this.getAsV31(contractAccount);
    } else if (this.isV74) {
      info = await this.getAsV74(contractAccount);
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
    const codeHash = decodeHex(key);
    if (this.isV31) {
      info = await this.getAsV31(codeHash);
    } else if (this.isV83) {
      info = await this.getAsV83(codeHash);
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
    const codeHash = decodeHex(key);
    if (this.isV31) {
      info = await this.getAsV31(codeHash);
    } else {
      throw new Error("No Runtime version found");
    }
    if (info) {
      return info;
    }
    throw new Error(`CodeStorage not found in storage for key [${key}]`);
  }
}
