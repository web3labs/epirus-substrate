/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { contractsExtrinsicHandlers } from "./index";
import { saveAll } from "../utils";
import {
  block,
  ctx,
  defaultGetStorageMock,
  getMockCall,
  getMockExtrinsic,
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

describe("contracts extrinsic handlers", () => {
  const call = getMockCall({ name: "Contracts.call" });
  const extrinsic = getMockExtrinsic({ withSignature: false });

  describe("contractsCallHandler", () => {
    const { contractsCallHandler } = contractsExtrinsicHandlers;
    beforeEach(() => {
      ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
    });

    it("should handle extrinsic", async () => {
      await contractsCallHandler.handle(ctx, call, extrinsic, block);
      expect(saveAll).toBeCalled();
    });

    it("should throw error if call destination is of type Index", async () => {
      // Override default decodeCall to return call destination of type Index
      ctx._chain.decodeCall = jest.fn(() => {
        return {
          dest: {
            __kind: "Index",
          },
        };
      });
      try {
        await contractsCallHandler.handle(ctx, call, extrinsic, block);
      } catch (error) {
        expect(error).toEqual(
          new Error("Multi-address of type Index is not supported!")
        );
      }
    });

    it("should throw error if call hash does not match any runtime versions", async () => {
      // Override default getCallHash to return a hash that does not match any runtime versions
      ctx._chain.getCallHash = jest.fn(() => {
        return "";
      });
      try {
        await contractsCallHandler.handle(ctx, call, extrinsic, block);
      } catch (error) {
        expect(error).toEqual(new Error("No Runtime version found"));
      }
    });
  });
});
