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
} from "../types/canvasKusamaV16";
import { ss58Format } from "../../../chain-config";

export class NormalisedSystemAccountStorage extends SystemAccountStorage {
  async get(accountId: string): Promise<AccountInfo> {
    assert(this.isExists);
    if (this.isCanvasKusamaV16) {
      return this.getAsCanvasKusamaV16(
        ss58.codec(ss58Format).decode(accountId)
      );
    }
    throw new Error("No Runtime version found");
  }
}

export class NormalisedBalancesAccountStorage extends BalancesAccountStorage {
  async get(accountId: string): Promise<AccountData> {
    assert(this.isExists);
    if (this.isCanvasKusamaV16) {
      return this.getAsCanvasKusamaV16(
        ss58.codec(ss58Format).decode(accountId)
      );
    }
    throw new Error("No Runtime version found");
  }
}

export class NormalisedContractInfoOfStorage extends ContractsContractInfoOfStorage {
  async get(accountId: string): Promise<ResolvedContractInfoOfStorage> {
    assert(this.isExists);
    let info: ResolvedContractInfoOfStorage | undefined;
    const key = ss58.codec(ss58Format).decode(accountId);
    if (this.isCanvasKusamaV16) {
      info = await this.getAsCanvasKusamaV16(key);
    } else if (this.isV9321) {
      info = await this.getAsV9321(key);
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
    if (this.isCanvasKusamaV16) {
      info = await this.getAsCanvasKusamaV16(decodeHex(key));
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
    if (this.isCanvasKusamaV16) {
      info = await this.getAsCanvasKusamaV16(decodeHex(key));
    } else {
      throw new Error("No Runtime version found");
    }
    if (info) {
      return info;
    }
    throw new Error(`CodeStorage not found in storage for key [${key}]`);
  }
}
