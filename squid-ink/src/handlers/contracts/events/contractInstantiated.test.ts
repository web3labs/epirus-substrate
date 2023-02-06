/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ContractCode } from "../../../model";
import { contractsInstantiatedHandler } from "./index";
import { saveAll } from "../../utils";
import { config } from "../../../config";
import abiDecoder from "../../../abi/decoder";
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

jest.mock("../../../config", () => {
  return {
    __esModule: true,
    config: {},
  };
});

jest.mock("../../../abi/decoder");

describe("contractsInstantiatedHandler", () => {
  const event = getMockEvent({ name: "Contracts.Instantiated" });

  beforeEach(() => {
    jest.clearAllMocks();
    ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
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

    await contractsInstantiatedHandler.handle(ctx, event, block);
    expect(saveAll).toBeCalled();
  });

  it("should decode events if source code feature is enabled", async () => {
    config.sourceCodeEnabled = true;
    const decodeConstructorSpy = jest.spyOn(abiDecoder, "decodeConstructor");
    await contractsInstantiatedHandler.handle(ctx, event, block);
    expect(decodeConstructorSpy).toBeCalled();
  });

  it("should not decode events if source code feature is not enabled", async () => {
    config.sourceCodeEnabled = false;
    const decodeConstructorSpy = jest.spyOn(abiDecoder, "decodeConstructor");
    await contractsInstantiatedHandler.handle(ctx, event, block);
    expect(decodeConstructorSpy).toBeCalledTimes(0);
  });

  it("should throw error if contract info is not found in storage", async () => {
    // Override mock chain storage to return undefined
    ctx._chain.getStorage.mockImplementation(() => {
      return undefined;
    });
    try {
      await contractsInstantiatedHandler.handle(ctx, event, block);
    } catch (error) {
      expect(error).toEqual(
        new Error(
          "ContractInfoOf not found in storage for accountId [5FdC6Cu8cFCZYTtiifx6f97KTogqwi1LNhFCrZBqrGnGDqLq]"
        )
      );
    }
  });

  it("should throw error if contract code entity is not found in database", async () => {
    // Mock store get function to return undefined
    ctx.store.get = jest.fn(async () => {
      return Promise.resolve(undefined);
    });
    try {
      await contractsInstantiatedHandler.handle(ctx, event, block);
    } catch (error) {
      expect(error).toEqual(
        new Error(
          "ContractCode entity is not found in the database for contract address [5FdC6Cu8cFCZYTtiifx6f97KTogqwi1LNhFCrZBqrGnGDqLq], please make sure that it is created and saved first."
        )
      );
    }
  });

  it("should log warning if there's no extrinsic and call", async () => {
    const mockEvent = getMockEvent({
      name: "Contracts.Instantiated",
      withCall: false,
      withExtrinsic: false,
    });
    await contractsInstantiatedHandler.handle(ctx, mockEvent, block);
    expect(ctx.log.warn).toBeCalled();
    expect(ctx.log.debug).toBeCalled();
  });
});
