/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  SubstrateBlock,
  SubstrateExtrinsic,
  SubstrateCall,
  decodeHex,
} from "@subsquid/substrate-processor";
import { Event } from "../types";
import { systemEventHandlers } from "./index";
import { createExtrinsic, saveAll, updateAccountBalance } from "../utils";

jest.mock("../utils");

interface Ctx {
  _chain: any;
  store: any;
  log: any;
  blocks: any;
}

describe("system events handlers", () => {
  let block: SubstrateBlock;
  let extrinsic: SubstrateExtrinsic;
  let call: SubstrateCall;
  let event: Event;
  let ctx: Ctx;

  beforeEach(() => {
    ctx = {
      _chain: {
        getStorageItemTypeHash: jest.fn((prefix: string, name: string) => {
          return `${prefix}-${name}`;
        }),
        getEventHash: jest.fn(() => {
          return "7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92";
        }),
        decodeEvent: jest.fn(() => {
          return {
            account: decodeHex(
              "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004"
            ),
          };
        }),
      },
      store: { save: jest.fn() },
      log: { warn: jest.fn() },
      blocks: jest.fn(),
    };

    block = {
      id: "682013-9ecc4",
      height: 682013,
      hash: "0x9ecc4cba937ddb8fd6b28b47b8f1c86fc4d03425881770c43ca4928841191f5f",
      parentHash:
        "0x239e3b7ba93cbfef4f8f36cd76d5b9ce7bd4a73e125815f3390e1ab860d2a48d",
      timestamp: 1658395014000,
      specId: "",
    };

    call = {
      id: "0000682013-000002-9ecc4",
      name: "Contracts.call",
      args: {
        data: "0xcfdd9aa2328b9524fa3a658575a8a0b32893c82768daddb1ff0a1fa80a84b81ff9f3d018",
        dest: {
          __kind: "Id",
          value:
            "0xc2046f8d86ed5cba648a73505758ee37c695a94c7438de01ef1190a7e95e91d0",
        },
        gasLimit: 20677883868,
        value: 0,
      },
      success: true,
      error: null,
      pos: 19,
    };

    extrinsic = {
      id: "0000682013-000002-9ecc4",
      indexInBlock: 2,
      version: 4,
      signature: undefined,
      call,
      fee: undefined,
      tip: BigInt(0),
      success: true,
      error: null,
      hash: "0xd67448c72dabbb64e06793c954727b06ad02a59be0ed2c5b82aa2cc3232a38c4",
      pos: 19,
    };

    event = {
      id: "0000682013-000004-9ecc4",
      name: "System.NewAccount",
      indexInBlock: 4,
      call,
      extrinsic,
      args: {
        account:
          "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004",
      },
    };
  });

  describe("systemNewAccountHandler", () => {
    it("should handle event", async () => {
      const { systemNewAccountHandler } = systemEventHandlers;
      await systemNewAccountHandler.handle(ctx, event, block);
      expect(updateAccountBalance).toBeCalledWith(
        ctx,
        "5EyR7vEk7DtvEWeefGcXXMV6hKwB8Ex5uvjHufm466mbjJkR",
        block
      );
      expect(createExtrinsic).toBeCalledWith(extrinsic, call, block);
      expect(saveAll).toBeCalled();
    });
  });
});
