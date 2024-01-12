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
import {
  AccountData,
  AccountInfo,
  OwnerInfo,
  PrefabWasmModule,
} from "../types/watrNodeV1000";
import { ss58Format } from "../../../chain-config";

export class NormalisedSystemAccountStorage extends SystemAccountStorage {
  async get(accountId: string): Promise<AccountInfo> {
    assert(this.isExists);
    if (this.isWatrNodeV1000) {
      return this.getAsWatrNodeV1000(ss58.codec(ss58Format).decode(accountId));
    }
    throw new Error("No Runtime version found");
  }
}

export class NormalisedBalancesAccountStorage extends BalancesAccountStorage {
  async get(accountId: string): Promise<AccountData> {
    assert(this.isExists);
    if (this.isWatrNodeV1000) {
      return this.getAsWatrNodeV1000(ss58.codec(ss58Format).decode(accountId));
    }
    throw new Error("No Runtime version found");
  }
}

export class NormalisedContractInfoOfStorage extends ContractsContractInfoOfStorage {
  async get(accountId: string): Promise<ResolvedContractInfoOfStorage> {
    assert(this.isExists);
    let info: ResolvedContractInfoOfStorage | undefined;
    if (this.isWatrNodeV1000) {
      info = await this.getAsWatrNodeV1000(
        ss58.codec(ss58Format).decode(accountId)
      );
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
    if (this.isWatrNodeV1000) {
      info = await this.getAsWatrNodeV1000(decodeHex(key));
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
    if (this.isWatrNodeV1000) {
      info = await this.getAsWatrNodeV1000(decodeHex(key));
    } else {
      throw new Error("No Runtime version found");
    }
    if (info) {
      return info;
    }
    throw new Error(`CodeStorage not found in storage for key [${key}]`);
  }
}
