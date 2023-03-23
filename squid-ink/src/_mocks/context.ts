/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SubstrateCall } from "@subsquid/substrate-processor";
import { decodeHex } from "@subsquid/util-internal-hex";
import { Event } from "handlers/types";
import { Account } from "../model";
import {
  CONTRACT_ACCOUNT,
  DATA_EMITTED,
  EOA_ACCOUNT,
  OLD_CODE_HASH,
  NEW_CODE_HASH,
  AMOUNT,
} from "./constants";
import { Ctx } from "./types";

export const store: any = {
  get: jest.fn(async (Entity: typeof Account, id: string) => {
    return Promise.resolve(new Entity({ id }));
  }),
  save: jest.fn(),
};

export const ctx: Ctx = {
  _chain: {
    getStorageItemTypeHash: jest.fn((prefix: string, name: string) => {
      return getStorageHashByPrefixName(prefix, name);
    }),
    getStorage: jest.fn(),
    getEventHash: jest.fn((name: string) => {
      return getEventHashByName(name);
    }),
    decodeEvent: jest.fn((event: Event) => {
      return getDecodeEventByName(event.name);
    }),
    getCallHash: jest.fn((name: string) => {
      return getCallHashByName(name);
    }),
    decodeCall: jest.fn((call: SubstrateCall) => {
      return getDecodeCallByName(call.name);
    }),
  },
  store,
  log: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
  blocks: jest.fn(),
};

export function defaultGetStorageMock() {
  return (
    blockHash: string,
    prefix: string,
    name: string,
    ...args: any[]
  ): any => {
    return getStorageByPrefixName(prefix, name);
  };
}

function getStorageHashByPrefixName(prefix: string, name: string): string {
  if (prefix === "Contracts") {
    if (name === "ContractInfoOf") {
      return "b19f56551b6001070487b6e33ba3a88bf2e7a48df38a8c979b2d69856127de63";
    }
    if (name === "CodeStorage") {
      return "d90967ccfb2cbaf184f7d41bb1a330beaf15a192d25803d6352047090a9e635e";
    }
    if (name === "OwnerInfoOf") {
      return "76689686c73821ee740f33d092a38a05de83a2833f6c8857baa886203c5bf939";
    }
  }
  if (prefix === "Balances" && name === "Account") {
    return "0b3b4bf0dd7388459eba461bc7c3226bf58608c941710a714e02f33ec0f91e78";
  }
  if (prefix === "System" && name === "Account") {
    return "1ddc7ade926221442c388ee4405a71c9428e548fab037445aaf4b3a78f4735c1";
  }
  return "";
}

function getStorageByPrefixName(prefix: string, name: string): any {
  if (prefix === "Contracts") {
    if (name === "ContractInfoOf") {
      return {
        trieId: decodeHex(
          "0xa012a6712a29e54a01530ca5b2d1ec90a143c6725f25ae7d00a070e7f06827b8"
        ),
        codeHash: decodeHex(OLD_CODE_HASH),
        storageDeposit: BigInt(6693666330),
      };
    }
    if (name === "CodeStorage") {
      return {
        code: decodeHex("0x"),
      };
    }
    if (name === "OwnerInfoOf") {
      return {
        owner: decodeHex(EOA_ACCOUNT),
      };
    }
  }
  if (prefix === "Balances" && name === "Account") {
    return {
      free: BigInt(987654321),
      reserved: BigInt(54321),
      feeFrozen: BigInt(0),
      miscFrozen: BigInt(0),
    };
  }
  if (prefix === "System" && name === "Account") {
    return {
      data: {
        free: BigInt(987654321),
        reserved: BigInt(54321),
        feeFrozen: BigInt(0),
        miscFrozen: BigInt(0),
      },
    };
  }
  return "";
}

function getEventHashByName(name: string): string {
  switch (name) {
    case "Contracts.ContractEmitted":
      return "7f28393268795b9a97f05e82911cdcc4200d99e9968c1ab6a564f949f753b929";
    case "Contracts.Instantiated":
      return "20f9f9057a4149f58eb48c00359f9800a42b51d4d2168437dfcce668c27a8d37";
    case "Contracts.CodeStored":
    case "Contracts.CodeRemoved":
      return "9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d";
    case "Contracts.ContractCodeUpdated":
      return "f9de6decda4961d31d7cf59e3f8acd4849a220323ebabbb036464d999de54c18";
    case "Contracts.Terminated":
      return "8e0b376b4821223ecd835a0ae76a615e7aa14158260ff9c7f87220449d98175b";
    case "Balances.Transfer":
      return "0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66";
    case "Balances.Withdraw":
    case "Balances.Reserved":
      return "e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5";
    case "Balances.Endowed":
      return "75951f685df19cbb5fdda09cf928a105518ceca9576d95bd18d4fac8802730ca";
    case "System.NewAccount":
      return "7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92";
    default:
      return "";
  }
}

function getDecodeEventByName(name: string): any {
  switch (name) {
    case "Contracts.ContractEmitted":
      return {
        contract: decodeHex(CONTRACT_ACCOUNT),
        data: decodeHex(DATA_EMITTED),
      };
    case "Contracts.Instantiated":
      return {
        contract: decodeHex(CONTRACT_ACCOUNT),
        deployer: decodeHex(EOA_ACCOUNT),
      };
    case "Contracts.CodeStored":
    case "Contracts.CodeRemoved":
      return {
        codeHash: decodeHex(OLD_CODE_HASH),
      };
    case "Contracts.ContractCodeUpdated":
      return {
        contract: decodeHex(CONTRACT_ACCOUNT),
        newCodeHash: decodeHex(NEW_CODE_HASH),
        oldCodeHash: decodeHex(OLD_CODE_HASH),
      };
    case "Contracts.Terminated":
      return {
        beneficiary: decodeHex(EOA_ACCOUNT),
        contract: decodeHex(CONTRACT_ACCOUNT),
      };
    case "Balances.Transfer":
      return {
        amount: BigInt(AMOUNT),
        from: decodeHex(EOA_ACCOUNT),
        to: decodeHex(CONTRACT_ACCOUNT),
      };
    case "Balances.Withdraw":
    case "Balances.Reserved":
      return {
        amount: BigInt(AMOUNT),
        who: decodeHex(EOA_ACCOUNT),
      };
    case "Balances.Endowed":
      return {
        account: decodeHex(EOA_ACCOUNT),
        freeBalance: BigInt(AMOUNT),
      };
    case "System.NewAccount":
      return {
        account: decodeHex(EOA_ACCOUNT),
      };
    default:
      return {};
  }
}

function getDecodeCallByName(name: string): any {
  switch (name) {
    case "Contracts.call":
      return {
        dest: {
          __kind: "Id",
          value: decodeHex(CONTRACT_ACCOUNT),
        },
        value: BigInt(0),
        gasLimit: BigInt(AMOUNT),
        data: decodeHex(DATA_EMITTED),
      };
    case "Contracts.instantiate_with_code":
      return {
        code: decodeHex("0x"),
        data: decodeHex(DATA_EMITTED),
        gasLimit: BigInt(AMOUNT),
        salt: decodeHex(
          "0x80615ff53d23697eb2859dee2e1a11696eeab825905d4131b08a4d292c72f383bf"
        ),
        storageDepositLimit: BigInt(AMOUNT),
        value: BigInt(0),
      };
    default:
      return {};
  }
}

function getCallHashByName(name: string): string {
  switch (name) {
    case "Contracts.call":
      return "9b1b707b0f5c537afca26d44d0081d29092614e330ff3810d328d0342d6a1845";
    default:
      return "";
  }
}
