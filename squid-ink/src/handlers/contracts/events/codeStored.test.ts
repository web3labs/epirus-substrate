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

  it("should decode events if source code feature is enabled", async () => {
    config.sourceCodeEnabled = true;
    const event = getMockEvent({ name: "Contracts.CodeStored" });
    const decodeConstructorSpy = jest.spyOn(abiDecoder, "decodeConstructor");
    await contractsCodeStoredHandler.handle(ctx, event, block);
    expect(decodeConstructorSpy).toBeCalled();
  });

  it("should still process other entities if error occurs during decoding", async () => {
    config.sourceCodeEnabled = true;
    const event = getMockEvent({ name: "Contracts.CodeStored" });
    const decodeConstructorSpy = jest
      .spyOn(abiDecoder, "decodeConstructor")
      .mockImplementation(() => {
        throw new Error();
      });

    ctx.store.save = jest.fn();
    await contractsCodeStoredHandler.handle(ctx, event, block);
    expect(decodeConstructorSpy).toBeCalled();
    expect(saveAll).toBeCalled();
    expect(ctx.log.error).toBeCalled();
  });
});
