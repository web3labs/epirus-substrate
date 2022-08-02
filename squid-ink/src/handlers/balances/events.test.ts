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
import { Event } from "handlers/types";
import { balancesEventHandlers } from "./index";
import { saveAll, updateAccountBalance } from "../utils";

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

describe("balances event handlers", () => {
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

  describe("balancesTransferHandler", () => {
    const { balancesTransferHandler } = balancesEventHandlers;

    beforeEach(() => {
      ctx._chain.getEventHash = jest.fn(() => {
        return "0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66";
      });
      ctx._chain.decodeEvent = jest.fn(() => {
        return {
          amount: BigInt(6671999880),
          from: decodeHex(
            "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004"
          ),
          to: decodeHex(
            "0x83306086b61ed52cbace7858aa8174f6a1f6a73e1ca27f28da5154e1417fa548"
          ),
        };
      });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should handle event", async () => {
      const event: Event = {
        args: {
          amount: "6671999880",
          from: "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004",
          to: "0x83306086b61ed52cbace7858aa8174f6a1f6a73e1ca27f28da5154e1417fa548",
        },
        call,
        extrinsic,
        id: "0000131276-000004-4d9ee",
        indexInBlock: 4,
        name: "Balances.Transfer",
      };

      await balancesTransferHandler.handle(ctx, event, block);
      expect(ctx.store.save).toBeCalledTimes(2);
      expect(updateAccountBalance).toBeCalledTimes(2);
      expect(saveAll).toBeCalled();
    });

    it("should log warning if extrinsic and call are undefined", async () => {
      const event: Event = {
        args: {
          amount: "6671999880",
          from: "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004",
          to: "0x83306086b61ed52cbace7858aa8174f6a1f6a73e1ca27f28da5154e1417fa548",
        },
        id: "0000131276-000004-4d9ee",
        indexInBlock: 4,
        name: "Balances.Transfer",
      };

      await balancesTransferHandler.handle(ctx, event, block);
      expect(ctx.log.warn).toBeCalled();
      expect(ctx.log.debug).toBeCalled();
    });
  });

  describe("balancesWithdrawHandler", () => {
    const { balancesWithdrawHandler } = balancesEventHandlers;
    const event: Event = {
      args: {
        amount: "1819778921",
        who: "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004",
      },
      id: "0000131276-000004-4d9ee",
      indexInBlock: 4,
      name: "Balances.Withdraw",
    };

    it("should update balance of account returned in event", async () => {
      ctx._chain.getEventHash = jest.fn(() => {
        return "e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5";
      });
      ctx._chain.decodeEvent = jest.fn(() => {
        return {
          amount: BigInt(1819778921),
          who: decodeHex(
            "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004"
          ),
        };
      });
      await balancesWithdrawHandler.handle(ctx, event, block);
      expect(updateAccountBalance).toBeCalledWith(
        ctx,
        "5EyR7vEk7DtvEWeefGcXXMV6hKwB8Ex5uvjHufm466mbjJkR",
        block
      );
    });
  });

  describe("balancesReservedHandler", () => {
    const { balancesReservedHandler } = balancesEventHandlers;
    const event: Event = {
      args: {
        amount: "1819778921",
        who: "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004",
      },
      id: "0000131276-000004-4d9ee",
      indexInBlock: 4,
      name: "Balances.Reserved",
    };

    it("should update balance of account returned in event", async () => {
      ctx._chain.getEventHash = jest.fn(() => {
        return "e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5";
      });
      ctx._chain.decodeEvent = jest.fn(() => {
        return {
          amount: BigInt(1819778921),
          who: decodeHex(
            "0x80ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e0004"
          ),
        };
      });
      await balancesReservedHandler.handle(ctx, event, block);
      expect(updateAccountBalance).toBeCalledWith(
        ctx,
        "5EyR7vEk7DtvEWeefGcXXMV6hKwB8Ex5uvjHufm466mbjJkR",
        block
      );
    });
  });
});
