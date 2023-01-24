/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { contractsCodeRemovedHandler } from "./index";
import { saveAll } from "../../utils";
import {
  block,
  getMockEvent,
  ctx,
  defaultGetStorageMock,
} from "../../../_mocks";
import { ContractCode } from "../../../model";

jest.mock("../../utils", () => {
  const originalModule = jest.requireActual("../../utils");
  return {
    __esModule: true,
    ...originalModule,
    saveAll: jest.fn(),
    updateAccountBalance: jest.fn(),
  };
});

describe("contractsCodeRemovedHandler", () => {
  const event = getMockEvent({ name: "Contracts.CodeRemoved" });
  beforeEach(() => {
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
    await contractsCodeRemovedHandler.handle(ctx, event, block);
    expect(saveAll).toBeCalled();
  });

  it("should throw error if contract entity is not found in database", async () => {
    // Mock store get function to return undefined
    ctx.store.get = jest.fn(async () => {
      return Promise.resolve(undefined);
    });
    try {
      await contractsCodeRemovedHandler.handle(ctx, event, block);
    } catch (error) {
      expect(error).toEqual(
        new Error(
          "Contract code entity is not found in the database for code hash [0x51606b677cc203a561cd0cfbba708024feb85f46fe42238afc55a115785e1f95]"
        )
      );
    }
  });
});
