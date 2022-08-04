/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { systemEventHandlers } from "./index";
import { createExtrinsic, saveAll, updateAccountBalance } from "../utils";
import {
  block,
  ctx,
  defaultGetStorageMock,
  getMockCall,
  getMockEvent,
  getMockExtrinsic,
} from "../../_mocks";

jest.mock("../utils");

describe("system events handlers", () => {
  describe("systemNewAccountHandler", () => {
    beforeEach(() => {
      ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
    });

    const event = getMockEvent({ name: "System.NewAccount" });
    const extrinsic = getMockExtrinsic({ withSignature: false });
    const call = getMockCall({ name: "Contracts.call" });

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
