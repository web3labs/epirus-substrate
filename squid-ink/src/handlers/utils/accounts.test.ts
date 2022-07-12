import { encodeAddress } from "./accounts";

const ALICE_PUB_KEY =
  "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";
const ALICE_SUBSTRATE_ADDRESS =
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";

describe("encodeAddress function", () => {
  test("CHAIN env variable should be defined", () => {
    expect(process.env.CHAIN).toBeDefined();
  });

  test("CHAIN env variable should be local", () => {
    expect(process.env.CHAIN).toBe("local");
  });

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
