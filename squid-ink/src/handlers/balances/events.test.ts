/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Event } from "handlers/types";
import { balancesEventHandlers } from "./index";
import { saveAll, updateAccountBalance } from "../utils";
import { block, ctx, defaultGetStorageMock, getMockEvent } from "../../_mocks";

jest.mock("../utils", () => {
  const originalModule = jest.requireActual("../utils");
  return {
    __esModule: true,
    ...originalModule,
    saveAll: jest.fn(),
    updateAccountBalance: jest.fn(),
  };
});

describe("balances event handlers", () => {
  describe("balancesTransferHandler", () => {
    const { balancesTransferHandler } = balancesEventHandlers;
    beforeEach(() => {
      ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
    });

    it("should handle event", async () => {
      const event: Event = getMockEvent({ name: "Balances.Transfer" });

      await balancesTransferHandler.handle(ctx, event, block);
      expect(ctx.store.save).toBeCalledTimes(2);
      expect(updateAccountBalance).toBeCalledTimes(2);
      expect(saveAll).toBeCalled();
    });

    it("should log warning if extrinsic and call are undefined", async () => {
      const event: Event = getMockEvent({
        name: "Balances.Transfer",
        withCall: false,
        withExtrinsic: false,
      });

      await balancesTransferHandler.handle(ctx, event, block);
      expect(ctx.log.warn).toBeCalled();
      expect(ctx.log.debug).toBeCalled();
    });
  });

  describe("balancesWithdrawHandler", () => {
    const { balancesWithdrawHandler } = balancesEventHandlers;
    const event: Event = getMockEvent({ name: "Balances.Withdraw" });
    beforeEach(() => {
      ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
    });

    it("should update balance of account returned in event", async () => {
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
    const event: Event = getMockEvent({ name: "Balances.Reserved" });
    beforeEach(() => {
      ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
    });

    it("should update balance of account returned in event", async () => {
      await balancesReservedHandler.handle(ctx, event, block);
      expect(updateAccountBalance).toBeCalledWith(
        ctx,
        "5EyR7vEk7DtvEWeefGcXXMV6hKwB8Ex5uvjHufm466mbjJkR",
        block
      );
    });
  });
});
