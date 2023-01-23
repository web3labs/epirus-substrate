/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Contract, ContractCode } from "../../model";
import { contractsEventHandlers } from "./index";
import { saveAll } from "../utils";
import {
  block,
  getMockEvent,
  ctx,
  defaultGetStorageMock,
} from "../../_mocks";

jest.mock("../utils", () => {
  const originalModule = jest.requireActual("../utils");
  return {
    __esModule: true,
    ...originalModule,
    saveAll: jest.fn(),
    updateAccountBalance: jest.fn(),
  };
});

describe("contracts event handlers", () => {
  describe("contractsInstantiatedHandler", () => {
    const { contractsInstantiatedHandler } = contractsEventHandlers;
    const event = getMockEvent({ name: "Contracts.Instantiated" });

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

      await contractsInstantiatedHandler.handle(ctx, event, block);
      expect(saveAll).toBeCalled();
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
  });

  describe("contractsEmittedHandler", () => {
    const { contractsEmittedHandler } = contractsEventHandlers;

    beforeEach(() => {
      ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
    });

    it("should handle event", async () => {
      const event = getMockEvent({ name: "Contracts.ContractEmitted" });
      await contractsEmittedHandler.handle(ctx, event, block);
      expect(saveAll).toBeCalled();
    });

    it("should log warning if there's no extrinsic and call", async () => {
      const event = getMockEvent({
        name: "Contracts.ContractEmitted",
        withCall: false,
        withExtrinsic: false,
      });
      await contractsEmittedHandler.handle(ctx, event, block);
      expect(ctx.log.warn).toBeCalled();
      expect(ctx.log.debug).toBeCalled();
    });
  });

  describe("contractsCodeStoredHandler", () => {
    const { contractsCodeStoredHandler } = contractsEventHandlers;
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

  describe("contractsCodeUpdatedHandler", () => {
    const { contractsCodeUpdatedHandler } = contractsEventHandlers;
    const event = getMockEvent({ name: "Contracts.ContractCodeUpdated" });
    beforeEach(() => {
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

  describe("contractsCodeRemovedHandler", () => {
    const { contractsCodeRemovedHandler } = contractsEventHandlers;
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

  describe("contractsTerminatedHandler", () => {
    const { contractsTerminatedHandler } = contractsEventHandlers;
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
});
