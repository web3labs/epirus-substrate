/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { contractsCodeStoredHandler } from "./index";
import { saveAll } from "../../utils";
import {
  block,
  getMockEvent,
  ctx,
  defaultGetStorageMock,
} from "../../../_mocks";

jest.mock("../../utils", () => {
  const originalModule = jest.requireActual("../../utils");
  return {
    __esModule: true,
    ...originalModule,
    saveAll: jest.fn(),
    updateAccountBalance: jest.fn(),
  };
});

describe("contractsCodeStoredHandler", () => {
  beforeEach(() => {
    ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
  });

  it("should handle event", async () => {
    const event = getMockEvent({ name: "Contracts.CodeStored" });
    await contractsCodeStoredHandler.handle(ctx, event, block);
    expect(saveAll).toBeCalled();
  });

  it("should log warning if there's no extrinsic or call", async () => {
    const event = getMockEvent({
      name: "Contracts.CodeStored",
      withCall: false,
      withExtrinsic: false,
    });
    await contractsCodeStoredHandler.handle(ctx, event, block);
    expect(ctx.log.warn).toBeCalled();
    expect(ctx.log.debug).toBeCalled();
  });
});
