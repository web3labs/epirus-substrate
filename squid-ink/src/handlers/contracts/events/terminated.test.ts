/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Contract } from "../../../model";
import { contractsTerminatedHandler } from "./index";
import { saveAll } from "../../utils";
import {
  block,
  getMockEvent,
  ctx,
  defaultGetStorageMock,
} from "../../../_mocks";

jest.mock("../utils", () => {
  const originalModule = jest.requireActual("../utils");
  return {
    __esModule: true,
    ...originalModule,
    saveAll: jest.fn(),
    updateAccountBalance: jest.fn(),
  };
});

describe("contractsTerminatedHandler", () => {
  beforeEach(() => {
    ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
  });

  it("should handle event", async () => {
    const event = getMockEvent({ name: "Contracts.Terminated" });
    // Mock store get function to return contract code entity
    ctx.store.get = jest.fn(async () => {
      return Promise.resolve(
        new Contract({
          id: "5FdC6Cu8cFCZYTtiifx6f97KTogqwi1LNhFCrZBqrGnGDqLq",
        })
      );
    });
    await contractsTerminatedHandler.handle(ctx, event, block);
    expect(saveAll).toBeCalled();
  });

  it("should throw error if contract entity is not found in database", async () => {
    const event = getMockEvent({ name: "Contracts.Terminated" });
    // Mock store get function to return undefined
    ctx.store.get = jest.fn(async () => {
      return Promise.resolve(undefined);
    });
    try {
      await contractsTerminatedHandler.handle(ctx, event, block);
    } catch (error) {
      expect(error).toEqual(
        new Error(
          "Contract entity is not found in the database for contract address [5FdC6Cu8cFCZYTtiifx6f97KTogqwi1LNhFCrZBqrGnGDqLq]"
        )
      );
    }
  });

  it("should log warning if extrinsic and call are not defined", async () => {
    const event = getMockEvent({
      name: "Contracts.Terminated",
      withCall: false,
      withExtrinsic: false,
    });
    // Mock store get function to return contract code entity
    ctx.store.get = jest.fn(async () => {
      return Promise.resolve(
        new Contract({
          id: "5FdC6Cu8cFCZYTtiifx6f97KTogqwi1LNhFCrZBqrGnGDqLq",
        })
      );
    });
    await contractsTerminatedHandler.handle(ctx, event, block);
    expect(ctx.log.warn).toBeCalled();
    expect(ctx.log.debug).toBeCalled();
  });
});
