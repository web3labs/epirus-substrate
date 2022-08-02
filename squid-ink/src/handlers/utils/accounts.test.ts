/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account } from "model";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import {
  NormalisedBalancesAccountStorage,
  NormalisedSystemAccountStorage,
} from "@chain/normalised-types";
import {
  encodeAddress,
  getOrCreateAccount,
  updateAccountBalance,
} from "./accounts";

jest.mock("@chain/normalised-types", () => ({
  __esModule: true,
  NormalisedBalancesAccountStorage: jest.fn().mockImplementation(() => {
    return {
      get: jest.fn(() => {
        return {
          free: 123456789,
          reserved: 12345,
          feeFrozen: 0,
          miscFrozen: 0,
        };
      }),
    };
  }),
  NormalisedSystemAccountStorage: jest.fn().mockImplementation(() => {
    return {
      get: jest.fn(() => {
        return {
          data: {
            free: 987654321,
            reserved: 54321,
            feeFrozen: 0,
            miscFrozen: 0,
          },
        };
      }),
    };
  }),
}));

const ALICE_PUB_KEY =
  "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
const ALICE_SUBSTRATE_ADDRESS =
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

const BOB_SUBSTRATE_ADDRESS =
  "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

interface Ctx {
  _chain: any;
  store: any;
  log: any;
  blocks: any;
}

describe("account utils", () => {
  let block: SubstrateBlock;
  let store: any;
  let ctx: Ctx;

  beforeAll(() => {
    block = {
      id: "727219-312ee",
      height: 727219,
      hash: "0x312eec5bee97fc47a0b5b06f6006edd1465dcc6c6e1e864f099028376cbd3aa2",
      parentHash:
        "0x6379433608c3856d91277a0398bb38847d664a8c3c50c9a60a6f1e3fdb060390",
      timestamp: 1659344359000,
      specId: "",
    };

    store = {
      get: jest.fn(async (Entity: typeof Account, id: string) => {
        if (id === ALICE_SUBSTRATE_ADDRESS) {
          return Promise.resolve(new Entity({ id }));
        }
        return undefined;
      }),
    };

    ctx = {
      _chain: {
        getStorageItemTypeHash: jest.fn((prefix: string, name: string) => {
          return `${prefix}-${name}`;
        }),
      },
      store,
      log: { warn: jest.fn() },
      blocks: jest.fn(),
    };
  });

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
    it("should return an account with balance updated from system balance storage", async () => {
      const account = await updateAccountBalance(
        ctx,
        ALICE_SUBSTRATE_ADDRESS,
        block
      );

      expect(account).toBeDefined();
      expect(account.id).toEqual(ALICE_SUBSTRATE_ADDRESS);
      expect(account.balance).toBeDefined();
      expect(account.balance?.free).toEqual(987654321);
      expect(account.balance?.reserved).toEqual(54321);
      expect(account.balance?.feeFrozen).toEqual(0);
      expect(account.balance?.miscFrozen).toEqual(0);
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
