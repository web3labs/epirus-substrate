/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { contractsCodeUpdatedHandler } from "./index";
import { saveAll } from "../../utils";
import {
  block,
  getMockEvent,
  ctx,
  defaultGetStorageMock,
} from "../../../_mocks";
import { Contract } from "../../../model";
import { config } from "../../../config";
import abiDecoder from "../../../abi/decoder";

jest.mock("../../utils", () => {
  const originalModule = jest.requireActual("../../utils");
  return {
    __esModule: true,
    ...originalModule,
    saveAll: jest.fn(),
    updateAccountBalance: jest.fn(),
  };
});

jest.mock("../../../config", () => {
  return {
    __esModule: true,
    config: {},
  };
});

jest.mock("../../../abi/decoder");

describe("contractsCodeUpdatedHandler", () => {
  const event = getMockEvent({ name: "Contracts.ContractCodeUpdated" });
  beforeEach(() => {
    jest.clearAllMocks();
    ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
  });

  it("should handle event", async () => {
    // Mock store get function to return contract code entity
    ctx.store.get = jest.fn(async () => {
      return Promise.resolve(
        new Contract({
          id: "5FdC6Cu8cFCZYTtiifx6f97KTogqwi1LNhFCrZBqrGnGDqLq",
        })
      );
    });
    await contractsCodeUpdatedHandler.handle(ctx, event, block);
    expect(saveAll).toBeCalled();
  });

  it("should decode events if source code feature is enabled", async () => {
    config.sourceCodeEnabled = true;
    const decodeMessageSpy = jest.spyOn(abiDecoder, "decodeMessage");
    await contractsCodeUpdatedHandler.handle(ctx, event, block);
    expect(decodeMessageSpy).toBeCalled();
  });

  it("should not decode events if source code feature is not enabled", async () => {
    config.sourceCodeEnabled = false;
    const decodeMessageSpy = jest.spyOn(abiDecoder, "decodeMessage");
    await contractsCodeUpdatedHandler.handle(ctx, event, block);
    expect(decodeMessageSpy).toBeCalledTimes(0);
  });

  it("should still process other entities if error occurs during decoding", async () => {
    config.sourceCodeEnabled = true;
    const decodeMessageSpy = jest
      .spyOn(abiDecoder, "decodeMessage")
      .mockImplementation(() => {
        throw new Error();
      });

    ctx.store.save = jest.fn();
    await contractsCodeUpdatedHandler.handle(ctx, event, block);
    expect(decodeMessageSpy).toBeCalled();
    expect(saveAll).toBeCalled();
    expect(ctx.log.error).toBeCalled();
  });

  it("should log warning if there's no extrinsic or call", async () => {
    const mockEvent = getMockEvent({
      name: "Contracts.ContractCodeUpdated",
      withCall: false,
      withExtrinsic: false,
    });
    await contractsCodeUpdatedHandler.handle(ctx, mockEvent, block);
    expect(ctx.log.warn).toBeCalled();
    expect(ctx.log.debug).toBeCalled();
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
          "Contract entity is not found in the database for contract address [5FdC6Cu8cFCZYTtiifx6f97KTogqwi1LNhFCrZBqrGnGDqLq], please make sure that it is created and saved first."
        )
      );
    }
  });
});
