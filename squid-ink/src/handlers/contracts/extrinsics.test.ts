/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  decodeHex,
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import { contractsExtrinsicHandlers } from "./index";
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

describe("contracts extrinsic handlers", () => {
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
    name: "Contracts.call",
    args: {
      data: "0x681266a03ea0dcd98d1a6134f1cef6bec8990498afbf17f84fab198621c60608f157d26301000000",
      dest: {
        __kind: "Id",
        value:
          "0x19693d580a8f5d7c8cb4d41f43fb7203a2c0ccb60d1682df44f67db9fd65ac29",
      },
      gasLimit: 7341000001,
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

  let ctx: Ctx;
  beforeEach(() => {
    ctx = {
      _chain: {
        getCallHash: jest.fn(),
        decodeCall: jest.fn(),
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

  describe("contractsCallHandler", () => {
    const { contractsCallHandler } = contractsExtrinsicHandlers;

    it("should handle extrinsic", async () => {
      ctx._chain.getCallHash = jest.fn(() => {
        return "d96c8a6656d7a4d6af6d5d0d51dd36e041c9ea8a92a7ead343d711addd74780f";
      });
      ctx._chain.decodeCall = jest.fn(() => {
        return {
          dest: {
            __kind: "Id",
            value: decodeHex(
              "0x19693d580a8f5d7c8cb4d41f43fb7203a2c0ccb60d1682df44f67db9fd65ac29"
            ),
          },
          value: BigInt(0),
          gasLimit: BigInt(7341000001),
          data: decodeHex(
            "0x681266a03ea0dcd98d1a6134f1cef6bec8990498afbf17f84fab198621c60608f157d26301000000"
          ),
        };
      });
      await contractsCallHandler.handle(ctx, call, extrinsic, block);
      expect(saveAll).toBeCalled();
    });

    it("should throw error if call hash does not match any runtime versions", async () => {
      ctx._chain.getCallHash = jest.fn(() => {
        return "";
      });
      try {
        await contractsCallHandler.handle(ctx, call, extrinsic, block);
      } catch (error) {
        expect(error).toEqual(new Error("No Runtime version found"));
      }
    });

    it("should throw error if call destination is of type Index", async () => {
      ctx._chain.getCallHash = jest.fn(() => {
        return "d96c8a6656d7a4d6af6d5d0d51dd36e041c9ea8a92a7ead343d711addd74780f";
      });
      ctx._chain.decodeCall = jest.fn(() => {
        return {
          dest: {
            __kind: "Index",
            value: decodeHex(
              "0x19693d580a8f5d7c8cb4d41f43fb7203a2c0ccb60d1682df44f67db9fd65ac29"
            ),
          },
        };
      });
      try {
        await contractsCallHandler.handle(ctx, call, extrinsic, block);
      } catch (error) {
        expect(error).toEqual(
          new Error("Multi-address of type Index is not supported!")
        );
      }
    });
  });
});
