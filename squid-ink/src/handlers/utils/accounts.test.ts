/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  encodeAddress,
  getOrCreateAccount,
  updateAccountBalance,
} from "./accounts";
import { block, ctx, defaultGetStorageMock, store } from "../../_mocks";

const ALICE_PUB_KEY =
  "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
const ALICE_SUBSTRATE_ADDRESS =
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
const BOB_SUBSTRATE_ADDRESS =
  "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

describe("account utils", () => {
  test("CHAIN should be set to 'local'", () => {
    expect(process.env.CHAIN).toBeDefined();
    expect(process.env.CHAIN).toBe("local");
  });

  describe("encodeAddress", () => {
    it("should encode Alice's key as Uint8Array to Substrate format", () => {
      const key = Buffer.from(ALICE_PUB_KEY, "hex");
      const address = encodeAddress(key);
      expect(address).toEqual(ALICE_SUBSTRATE_ADDRESS);
    });

    it("should encode Alice's key as hex string to Substrate format", () => {
      const key = `0x${ALICE_PUB_KEY}`;
      const address = encodeAddress(key);
      expect(address).toEqual(ALICE_SUBSTRATE_ADDRESS);
    });

    it("should fail on non-valid input", () => {
      expect(() => encodeAddress("a_random_string")).toThrow();
    });
  });

  describe("updateAccountBalance", () => {
    beforeEach(() => {
      ctx._chain.getStorage.mockImplementation(defaultGetStorageMock());
    });

    it("should return an account with balance updated from system balance storage", async () => {
      const account = await updateAccountBalance(
        ctx,
        ALICE_SUBSTRATE_ADDRESS,
        block
      );

      expect(account).toBeDefined();
      expect(account.id).toEqual(ALICE_SUBSTRATE_ADDRESS);
      expect(account.balance).toBeDefined();
      expect(account.balance?.free).toEqual(BigInt(987654321));
      expect(account.balance?.reserved).toEqual(BigInt(54321));
      expect(account.balance?.feeFrozen).toEqual(BigInt(0));
      expect(account.balance?.miscFrozen).toEqual(BigInt(0));
    });
  });

  describe("getOrCreateAccount", () => {
    it("should get Alice account", async () => {
      const account = await getOrCreateAccount(
        store,
        ALICE_SUBSTRATE_ADDRESS,
        block
      );
      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.id).toEqual(ALICE_SUBSTRATE_ADDRESS);
    });

    it("should create Bob account", async () => {
      const account = await getOrCreateAccount(
        store,
        BOB_SUBSTRATE_ADDRESS,
        block
      );
      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.id).toEqual(BOB_SUBSTRATE_ADDRESS);
    });
  });
});
