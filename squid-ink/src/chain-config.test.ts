/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ChainProperties, Token } from "./model";
import { ChainPropertiesStore } from "./chain-config";
import { ctx } from "./_mocks";

describe("ChainPropertiesStore", () => {
  let chainPropertiesStore: ChainPropertiesStore;

  beforeEach(() => {
    chainPropertiesStore = new ChainPropertiesStore();
  });

  it("should save token and chain properties", async () => {
    const expectedTokenEntity = new Token({
      id: "0",
      tokenDecimals: 12,
      tokenSymbol: "Unit",
    });
    const expectedChainPropertiesEntity = new ChainProperties({
      id: "chain_properties",
      name: "Local Contracts Chain",
      token: expectedTokenEntity,
      ss58Format: 42,
    });

    await chainPropertiesStore.save(ctx);
    expect(ctx.store.save).toHaveBeenCalledWith(expectedTokenEntity);
    expect(ctx.store.save).toHaveBeenCalledWith(expectedChainPropertiesEntity);
  });

  it("should only save chain properties once", async () => {
    const publicSaveMethod = jest.spyOn(chainPropertiesStore, "save");
    const mockPrivateSaveMethod = jest
      .spyOn(ChainPropertiesStore.prototype as any, "_save")
      .mockImplementation(() => {});
    await chainPropertiesStore.save(ctx);
    await chainPropertiesStore.save(ctx);
    await chainPropertiesStore.save(ctx);
    await chainPropertiesStore.save(ctx);
    await chainPropertiesStore.save(ctx);

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
      await chainPropertiesStore.save(ctx);
    } catch (error) {
      expect(error).toEqual(new Error("oops"));
    }
  });
});
