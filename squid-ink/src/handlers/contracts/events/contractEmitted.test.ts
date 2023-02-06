/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import abiDecoder from "../../../abi/decoder";
import { contractsEmittedHandler } from "./index";
import { saveAll } from "../../utils";
import {
  block,
  getMockEvent,
  ctx,
  defaultGetStorageMock,
} from "../../../_mocks";
import { config } from "../../../config";

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

describe("contractsEmittedHandler", () => {
  const event = getMockEvent({ name: "Contracts.ContractEmitted" });

  beforeEach(() => {
    jest.clearAllMocks();
    ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
  });

  it("should handle event", async () => {
    await contractsEmittedHandler.handle(ctx, event, block);
    expect(saveAll).toBeCalled();
  });

  it("should decode events if source code feature is enabled", async () => {
    config.sourceCodeEnabled = true;
    const decodeEventSpy = jest.spyOn(abiDecoder, "decodeEvent");
    await contractsEmittedHandler.handle(ctx, event, block);
    expect(decodeEventSpy).toBeCalled();
  });

  it("should not decode events if source code feature is not enabled", async () => {
    config.sourceCodeEnabled = false;
    const decodeEventSpy = jest.spyOn(abiDecoder, "decodeEvent");
    await contractsEmittedHandler.handle(ctx, event, block);
    expect(decodeEventSpy).toBeCalledTimes(0);
  });

  it("should log warning if there's no extrinsic and call", async () => {
    const mockEvent = getMockEvent({
      name: "Contracts.ContractEmitted",
      withCall: false,
      withExtrinsic: false,
    });
    await contractsEmittedHandler.handle(ctx, mockEvent, block);
    expect(ctx.log.warn).toBeCalled();
    expect(ctx.log.debug).toBeCalled();
  });
});
