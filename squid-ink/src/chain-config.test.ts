/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainPropertiesStore } from "./chain-config";

// jest.mock("./chain-config", () => () => ({
//   __esModule: true,
//   ChainPropertiesStore: jest.fn().mockImplementation(() => {
//     return {
//       stored: false,
//       _save: jest.fn(),
//     };
//   }),
// }));

const chainPropertiesStore = new ChainPropertiesStore();

interface Ctx {
  _chain: any;
  store: any;
  log: any;
  blocks: any;
}

describe("ChainPropertiesStore", () => {
  let mockCtx: Ctx;

  beforeAll(() => {
    mockCtx = {
      _chain: {
        getStorageItemTypeHash: jest.fn((prefix: string, name: string) => {
          return `${prefix}-${name}`;
        }),
      },
      store: {
        save: jest.fn(),
      },
      log: { error: jest.fn() },
      blocks: jest.fn(),
    };
  });

  it("should only save chain properties once", async () => {
    const publicSaveMethod = jest.spyOn(chainPropertiesStore, "save");
    const mockPrivateSaveMethod = jest
      .spyOn(ChainPropertiesStore.prototype as any, "_save")
      .mockImplementation(() => {});
    await chainPropertiesStore.save(mockCtx);
    await chainPropertiesStore.save(mockCtx);
    await chainPropertiesStore.save(mockCtx);
    await chainPropertiesStore.save(mockCtx);
    await chainPropertiesStore.save(mockCtx);

    expect(publicSaveMethod).toBeCalledTimes(5);
    expect(mockPrivateSaveMethod).toBeCalledTimes(1);
  });

  it("should catch error", async () => {
    jest
      .spyOn(ChainPropertiesStore.prototype as any, "_save")
      .mockImplementation(() => {
        throw new Error("oops");
      });

    try {
      await chainPropertiesStore.save(mockCtx);
    } catch (err) {
      expect(err).toMatch("oops");
    }
  });
});
