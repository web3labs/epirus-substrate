import fs from "node:fs";
import abiDecoder from "./decoder";
import { DecodedElement } from "./types";

const mockFetch = jest.fn();

jest.mock("node-fetch", () => () => mockFetch() as jest.Mock);

const okRes = Promise.resolve({
  status: 200,
  json: () =>
    Promise.resolve(
      JSON.parse(
        fs
          .readFileSync(`${__dirname}/../_mocks/data/c491_metadata.json`)
          .toString("utf8")
      )
    ),
});

const codeHash =
  "0xc491a5ee6dc564664f0cd3ee62a7de6e0d3ea0d6d93d5642b8fa80529378e967";
// Transfer From
const data =
  "0x0b396f188eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4890b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22005039278c0400000000000000000000";
const expectedDecodedData: DecodedElement = {
  name: "transfer_from",
  args: [
    {
      name: "from",
      value:
        "0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
      type: "AccountId",
      displayName: undefined,
    },
    {
      name: "to",
      value:
        "0x90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22",
      type: "AccountId",
      displayName: undefined,
    },
    {
      name: "value",
      value: "5000000000000",
      type: "Balance",
      displayName: undefined,
    },
  ],
};

describe("ABI Decoder", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    abiDecoder._cacheClear();
  });

  it("should decode message correctly", async () => {
    mockFetch.mockReturnValueOnce(okRes);

    const decoded = await abiDecoder.decodeMessage({
      codeHash,
      data,
    });

    expect(decoded).toBeDefined();
    expect(decoded).toEqual(expectedDecodedData);
  });

  it("should handle metadata not found", async () => {
    mockFetch.mockReturnValueOnce(
      Promise.resolve({
        status: 404,
      })
    );

    const decoded = await abiDecoder.decodeMessage({
      codeHash,
      data,
    });

    expect(decoded).toBeUndefined();
  });

  it("should handle unknown message selector", async () => {
    mockFetch.mockReturnValueOnce(okRes);

    await expect(async () => {
      await abiDecoder.decodeMessage({
        codeHash,
        data: "0x12345678900000001",
      });
    }).rejects.toThrow("Unknown selector: 0x12345678");
  });

  it("should handle wrong message data args", async () => {
    mockFetch.mockReturnValueOnce(okRes);

    await expect(async () => {
      await abiDecoder.decodeMessage({
        codeHash,
        data: "0x0b396f188eaf04151687736326c9fea17e25fc5287613693c912909cb226aa",
      });
    }).rejects.toThrow("Unexpected EOF");
  });

  it("should use cached context to decode a message", async () => {
    mockFetch.mockReturnValueOnce(okRes);

    const decoded = await abiDecoder.decodeMessage({
      codeHash,
      data,
    });
    expect(decoded?.name).toBe("transfer_from");

    // Hit cache
    for (let i = 0; i <= 10; i += 1) {
      expect(
        (
          await abiDecoder.decodeMessage({
            codeHash,
            data,
          })
        )?.name
      ).toBe("transfer_from");
    }

    expect(mockFetch).toBeCalledTimes(1);
  });
});
