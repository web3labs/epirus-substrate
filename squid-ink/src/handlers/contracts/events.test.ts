/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  SubstrateBlock,
  SubstrateExtrinsic,
  SubstrateCall,
  decodeHex,
} from "@subsquid/substrate-processor";
import { Contract, ContractCode } from "../../model";
import { Event } from "../types";
import { contractsEventHandlers } from "./index";
import { saveAll } from "../utils";

jest.mock("../utils", () => {
  const originalModule = jest.requireActual("../utils");
  return {
    __esModule: true,
    ...originalModule,
    saveAll: jest.fn(),
    updateAccountBalance: jest.fn(),
  };
});

interface Ctx {
  _chain: any;
  store: any;
  log: any;
  blocks: any;
}

describe("contracts event handlers", () => {
  const block: SubstrateBlock = {
    id: "682013-9ecc4",
    height: 682013,
    hash: "0x9ecc4cba937ddb8fd6b28b47b8f1c86fc4d03425881770c43ca4928841191f5f",
    parentHash:
      "0x239e3b7ba93cbfef4f8f36cd76d5b9ce7bd4a73e125815f3390e1ab860d2a48d",
    timestamp: 1658395014000,
    specId: "",
  };

  const call: SubstrateCall = {
    id: "0000682013-000002-9ecc4",
    name: "Contracts.instantiate_with_code",
    args: {
      code: "0x",
      data: "0x9bae9d5e",
      gasLimit: 18182645,
      salt: "0x80615ff53d23697eb2859dee2e1a11696eeab825905d4131b08a4d292c72f383bf",
      storageDepositLimit: 10000000000000,
      value: 0,
    },
    success: true,
    pos: 19,
  };

  const extrinsic: SubstrateExtrinsic = {
    id: "0000682013-000002-9ecc4",
    indexInBlock: 2,
    version: 4,
    call,
    success: true,
    hash: "0xd67448c72dabbb64e06793c954727b06ad02a59be0ed2c5b82aa2cc3232a38c4",
    pos: 19,
  };

  describe("contractsInstantiatedHandler", () => {
    let ctx: Ctx;
    const { contractsInstantiatedHandler } = contractsEventHandlers;
    const event: Event = {
      id: "0000682013-000004-9ecc4",
      name: "Contracts.Instantiated",
      indexInBlock: 4,
      call,
      extrinsic,
      args: {
        contract:
          "0x19693d580a8f5d7c8cb4d41f43fb7203a2c0ccb60d1682df44f67db9fd65ac29",
        deployer:
          "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004",
      },
    };
    beforeEach(() => {
      ctx = {
        _chain: {
          getStorageItemTypeHash: jest.fn(() => {
            return "ca1ad2ae4b550883411d45c2158af4f3e2a0bde306e44674a586527ce222bcf3";
          }),
          getEventHash: jest.fn(() => {
            return "20f9f9057a4149f58eb48c00359f9800a42b51d4d2168437dfcce668c27a8d37";
          }),
          decodeEvent: jest.fn(() => {
            return {
              contract: decodeHex(
                "0x19693d580a8f5d7c8cb4d41f43fb7203a2c0ccb60d1682df44f67db9fd65ac29"
              ),
              deployer: decodeHex(
                "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004"
              ),
            };
          }),
          getStorage: jest.fn(),
        },
        store: {
          save: jest.fn(),
          get: jest.fn(),
        },
        log: { warn: jest.fn() },
        blocks: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle event", async () => {
      // Mock chain storage get function to return contract info
      ctx._chain.getStorage = jest.fn(() => {
        return {
          trieId: decodeHex(
            "0xa012a6712a29e54a01530ca5b2d1ec90a143c6725f25ae7d00a070e7f06827b8"
          ),
          codeHash: decodeHex(
            "0x5b674dd2312e23afbde4cdd2488c96345f437c11685655871205b3346ad67867"
          ),
          storageDeposit: BigInt(6693666330),
        };
      });
      // Mock store get function to return contract code entity
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(
          new ContractCode({
            id: "0x5b674dd2312e23afbde4cdd2488c96345f437c11685655871205b3346ad67867",
          })
        );
      });

      await contractsInstantiatedHandler.handle(ctx, event, block);
      expect(saveAll).toBeCalled();
    });

    it("should throw error if contract info is not found in storage", async () => {
      // Mock chain storage to return undefined
      ctx._chain.getStorage = jest.fn(() => {
        return undefined;
      });
      try {
        await contractsInstantiatedHandler.handle(ctx, event, block);
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "ContractInfoOf not found in storage for accountId [5Ce2KLZbWefjtzkzcGNv4QEiD5uWRdLVeaSotRVn43Lwq8hE]"
          )
        );
      }
    });

    it("should throw error if contract code entity is not found in database", async () => {
      // Mock chain storage get function to return contract info
      ctx._chain.getStorage = jest.fn(() => {
        return {
          trieId: decodeHex(
            "0xa012a6712a29e54a01530ca5b2d1ec90a143c6725f25ae7d00a070e7f06827b8"
          ),
          codeHash: decodeHex(
            "0x5b674dd2312e23afbde4cdd2488c96345f437c11685655871205b3346ad67867"
          ),
          storageDeposit: BigInt(6693666330),
        };
      });
      // Mock store get function to return undefined
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(undefined);
      });
      try {
        await contractsInstantiatedHandler.handle(ctx, event, block);
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "ContractCode entity is not found in the database for contract address [5Ce2KLZbWefjtzkzcGNv4QEiD5uWRdLVeaSotRVn43Lwq8hE], please make sure that it is created and saved first."
          )
        );
      }
    });
  });

  describe("contractsEmittedHandler", () => {
    const { contractsEmittedHandler } = contractsEventHandlers;
    const ctx: Ctx = {
      _chain: {
        getEventHash: jest.fn(() => {
          return "7f28393268795b9a97f05e82911cdcc4200d99e9968c1ab6a564f949f753b929";
        }),
        decodeEvent: jest.fn(() => {
          return {
            contract: decodeHex(
              "0x19693d580a8f5d7c8cb4d41f43fb7203a2c0ccb60d1682df44f67db9fd65ac29"
            ),
            data: decodeHex(
              "0x00000180ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e000400000000000000000000000000000000"
            ),
          };
        }),
      },
      store: {
        save: jest.fn(),
        get: jest.fn(),
      },
      log: { warn: jest.fn(), debug: jest.fn() },
      blocks: jest.fn(),
    };

    it("should handle event", async () => {
      const event: Event = {
        id: "0000682013-000004-9ecc4",
        name: "Contracts.ContractEmitted",
        indexInBlock: 4,
        call,
        extrinsic,
        args: {
          contract:
            "0x9d7b986bdfeff1543813431dd9f2298b8ab6af5f62f6ac257fe0e034161c7871",
          data: "0x00000180ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e000400000000000000000000000000000000",
        },
      };
      await contractsEmittedHandler.handle(ctx, event, block);
      expect(saveAll).toBeCalled();
    });

    it("should log warning if there's no extrinsic and call", async () => {
      const event: Event = {
        id: "0000682013-000004-9ecc4",
        name: "Contracts.ContractEmitted",
        indexInBlock: 4,
        args: {
          contract:
            "0x9d7b986bdfeff1543813431dd9f2298b8ab6af5f62f6ac257fe0e034161c7871",
          data: "0x00000180ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e000400000000000000000000000000000000",
        },
      };
      await contractsEmittedHandler.handle(ctx, event, block);
      expect(ctx.log.warn).toBeCalled();
      expect(ctx.log.debug).toBeCalled();
    });
  });

  describe("contractsCodeStoredHandler", () => {
    const { contractsCodeStoredHandler } = contractsEventHandlers;
    const ctx: Ctx = {
      _chain: {
        getEventHash: jest.fn(() => {
          return "9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d";
        }),
        decodeEvent: jest.fn(() => {
          return {
            codeHash: decodeHex(
              "0x5b674dd2312e23afbde4cdd2488c96345f437c11685655871205b3346ad67867"
            ),
          };
        }),
      },
      store: {
        save: jest.fn(),
        get: jest.fn(),
      },
      log: { warn: jest.fn(), debug: jest.fn() },
      blocks: jest.fn(),
    };

    it("should handle event", async () => {
      const event: Event = {
        id: "0000682013-000004-9ecc4",
        name: "Contracts.CodeStored",
        indexInBlock: 4,
        call,
        extrinsic,
        args: {
          codeHash:
            "0x5b674dd2312e23afbde4cdd2488c96345f437c11685655871205b3346ad67867",
        },
      };
      // Mock chain storage hash for code storage or contract owner info
      ctx._chain.getStorageItemTypeHash = jest.fn(
        (pallet: string, name: string) => {
          if (pallet === "Contracts" && name === "CodeStorage") {
            return "1d41f869264eec7411828c1a845cdbad1a39455691f254f6bfead6b3102145ab";
          }
          if (pallet === "Contracts" && name === "OwnerInfoOf") {
            return "76689686c73821ee740f33d092a38a05de83a2833f6c8857baa886203c5bf939";
          }
          return undefined;
        }
      );
      // Mock chain storage get function to return either code storage or contract owner info
      ctx._chain.getStorage = jest.fn(
        (blockHash: string, prefix: string, name: string, ...args: any[]) => {
          if (prefix === "Contracts" && name === "CodeStorage") {
            return {
              code: decodeHex("0x"),
            };
          }
          if (prefix === "Contracts" && name === "OwnerInfoOf") {
            return {
              owner: decodeHex(
                "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004"
              ),
            };
          }
          return undefined;
        }
      );
      await contractsCodeStoredHandler.handle(ctx, event, block);
      expect(saveAll).toBeCalled();
    });

    it("should log warning if there's no extrinsic or call", async () => {
      const event: Event = {
        id: "0000682013-000004-9ecc4",
        name: "Contracts.CodeStored",
        indexInBlock: 4,
        args: {
          codeHash:
            "0x5b674dd2312e23afbde4cdd2488c96345f437c11685655871205b3346ad67867",
        },
      };
      await contractsCodeStoredHandler.handle(ctx, event, block);
      expect(ctx.log.warn).toBeCalled();
      expect(ctx.log.debug).toBeCalled();
    });
  });

  describe("contractsCodeUpdatedHandler", () => {
    let ctx: Ctx;
    const { contractsCodeUpdatedHandler } = contractsEventHandlers;
    const event: Event = {
      id: "0000682013-000004-9ecc4",
      name: "Contracts.ContractCodeUpdated",
      indexInBlock: 4,
      call,
      extrinsic,
      args: {
        contract:
          "0x091d7abcfe198e41113210a0577f46820ec8bf8733a85cdddb768747f4715a77",
        newCodeHash:
          "0xc21655c20a26e0b6d5d7792c723fc2c170f1e50dede992114b0814118bd07dcd",
        oldCodeHash:
          "0x51606b677cc203a561cd0cfbba708024feb85f46fe42238afc55a115785e1f95",
      },
    };

    beforeEach(() => {
      ctx = {
        _chain: {
          getEventHash: jest.fn(() => {
            return "f9de6decda4961d31d7cf59e3f8acd4849a220323ebabbb036464d999de54c18";
          }),
          decodeEvent: jest.fn(() => {
            return {
              contract: decodeHex(
                "0x091d7abcfe198e41113210a0577f46820ec8bf8733a85cdddb768747f4715a77"
              ),
              newCodeHash: decodeHex(
                "0xc21655c20a26e0b6d5d7792c723fc2c170f1e50dede992114b0814118bd07dcd"
              ),
              oldCodeHash: decodeHex(
                "0x51606b677cc203a561cd0cfbba708024feb85f46fe42238afc55a115785e1f95"
              ),
            };
          }),
          getStorageItemTypeHash: jest.fn((pallet: string, name: string) => {
            if (pallet === "Contracts" && name === "CodeStorage") {
              return "1d41f869264eec7411828c1a845cdbad1a39455691f254f6bfead6b3102145ab";
            }
            if (pallet === "Contracts" && name === "OwnerInfoOf") {
              return "76689686c73821ee740f33d092a38a05de83a2833f6c8857baa886203c5bf939";
            }
            return undefined;
          }),
          getStorage: jest.fn(
            (
              blockHash: string,
              prefix: string,
              name: string,
              ...args: any[]
            ) => {
              if (prefix === "Contracts" && name === "CodeStorage") {
                return {
                  code: decodeHex("0x"),
                };
              }
              if (prefix === "Contracts" && name === "OwnerInfoOf") {
                return {
                  owner: decodeHex(
                    "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004"
                  ),
                };
              }
              return undefined;
            }
          ),
        },
        store: {
          save: jest.fn(),
          get: jest.fn(),
        },
        log: { info: jest.fn(), warn: jest.fn() },
        blocks: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle event", async () => {
      // Mock store get function to return contract code entity
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(
          new Contract({
            id: "5CGf3aoVV6836wK7D9gEmgfDG24VhJZ2BQu3DJmMcMY7jwfM",
          })
        );
      });
      await contractsCodeUpdatedHandler.handle(ctx, event, block);
      expect(saveAll).toBeCalled();
    });

    it("should throw error if contract entity is not found in database", async () => {
      // Mock store get function to return undefined
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(undefined);
      });
      try {
        await contractsCodeUpdatedHandler.handle(ctx, event, block);
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "Contract entity is not found in the database for contract address [5CGf3aoVV6836wK7D9gEmgfDG24VhJZ2BQu3DJmMcMY7jwfM], please make sure that it is created and saved first."
          )
        );
      }
    });
  });

  describe("contractsCodeRemovedHandler", () => {
    let ctx: Ctx;
    const { contractsCodeRemovedHandler } = contractsEventHandlers;
    const event: Event = {
      id: "0000682013-000004-9ecc4",
      name: "Contracts.CodeRemoved",
      indexInBlock: 4,
      call,
      extrinsic,
      args: {
        codeHash:
          "0x51606b677cc203a561cd0cfbba708024feb85f46fe42238afc55a115785e1f95",
      },
    };

    beforeEach(() => {
      ctx = {
        _chain: {
          getEventHash: jest.fn(() => {
            return "9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d";
          }),
          decodeEvent: jest.fn(() => {
            return {
              codeHash: decodeHex(
                "0x51606b677cc203a561cd0cfbba708024feb85f46fe42238afc55a115785e1f95"
              ),
            };
          }),
        },
        store: {
          save: jest.fn(),
          get: jest.fn(),
        },
        log: { info: jest.fn(), warn: jest.fn() },
        blocks: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle event", async () => {
      // Mock store get function to return contract code entity
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(
          new ContractCode({
            id: "0x51606b677cc203a561cd0cfbba708024feb85f46fe42238afc55a115785e1f95",
          })
        );
      });
      await contractsCodeRemovedHandler.handle(ctx, event, block);
      expect(saveAll).toBeCalled();
    });

    it("should throw error if contract entity is not found in database", async () => {
      // Mock store get function to return undefined
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(undefined);
      });
      try {
        await contractsCodeRemovedHandler.handle(ctx, event, block);
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "Contract code entity is not found in the database for code hash [0x51606b677cc203a561cd0cfbba708024feb85f46fe42238afc55a115785e1f95]"
          )
        );
      }
    });
  });

  describe("contractsTerminatedHandler", () => {
    let ctx: Ctx;
    const { contractsTerminatedHandler } = contractsEventHandlers;

    beforeEach(() => {
      ctx = {
        _chain: {
          getEventHash: jest.fn(() => {
            return "8e0b376b4821223ecd835a0ae76a615e7aa14158260ff9c7f87220449d98175b";
          }),
          decodeEvent: jest.fn(() => {
            return {
              beneficiary: decodeHex(
                "0xb8b252915f3539ec83e068f10cff92dac918f2b92005eb16ba0e6208924c5b1d"
              ),
              contract: decodeHex(
                "0xa8de32e63aab2ee3d023b4a46fe510367426804e05204c9eb5d01af469e89a27"
              ),
            };
          }),
        },
        store: {
          save: jest.fn(),
          get: jest.fn(),
        },
        log: { info: jest.fn(), warn: jest.fn(), debug: jest.fn() },
        blocks: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle event", async () => {
      const event: Event = {
        id: "0000682013-000004-9ecc4",
        name: "Contracts.Terminated",
        indexInBlock: 4,
        call,
        extrinsic,
        args: {
          beneficiary:
            "0xb8b252915f3539ec83e068f10cff92dac918f2b92005eb16ba0e6208924c5b1d",
          contract:
            "0xa8de32e63aab2ee3d023b4a46fe510367426804e05204c9eb5d01af469e89a27",
        },
      };
      // Mock store get function to return contract code entity
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(
          new Contract({
            id: "5Ft7uet8nWWy438kAfoCj5cRR9bet72aDyvAcKVuKqZjbXFo",
          })
        );
      });
      await contractsTerminatedHandler.handle(ctx, event, block);
      expect(saveAll).toBeCalled();
    });

    it("should throw error if contract entity is not found in database", async () => {
      const event: Event = {
        id: "0000682013-000004-9ecc4",
        name: "Contracts.Terminated",
        indexInBlock: 4,
        call,
        extrinsic,
        args: {
          beneficiary:
            "0xb8b252915f3539ec83e068f10cff92dac918f2b92005eb16ba0e6208924c5b1d",
          contract:
            "0xa8de32e63aab2ee3d023b4a46fe510367426804e05204c9eb5d01af469e89a27",
        },
      };
      // Mock store get function to return undefined
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(undefined);
      });
      try {
        await contractsTerminatedHandler.handle(ctx, event, block);
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "Contract entity is not found in the database for contract address [5Ft7uet8nWWy438kAfoCj5cRR9bet72aDyvAcKVuKqZjbXFo]"
          )
        );
      }
    });

    it("should log warning if extrinsic and call are not defined", async () => {
      const event: Event = {
        id: "0000682013-000004-9ecc4",
        name: "Contracts.Terminated",
        indexInBlock: 4,
        args: {
          beneficiary:
            "0xb8b252915f3539ec83e068f10cff92dac918f2b92005eb16ba0e6208924c5b1d",
          contract:
            "0xa8de32e63aab2ee3d023b4a46fe510367426804e05204c9eb5d01af469e89a27",
        },
      };
      // Mock store get function to return contract code entity
      ctx.store.get = jest.fn(async () => {
        return Promise.resolve(
          new Contract({
            id: "5Ft7uet8nWWy438kAfoCj5cRR9bet72aDyvAcKVuKqZjbXFo",
          })
        );
      });
      await contractsTerminatedHandler.handle(ctx, event, block);
      expect(ctx.log.warn).toBeCalled();
      expect(ctx.log.debug).toBeCalled();
    });
  });
});
