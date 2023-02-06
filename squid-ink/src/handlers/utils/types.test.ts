import { toHex } from "@subsquid/util-internal-hex";
import { dataToString } from "./types";

describe("types util", () => {
  describe("dataToString", () => {
    it("should return empty string if input is undefined", () => {
      const output = dataToString(undefined);
      expect(output).toBe("");
    });

    it("should convert bigint input to string", () => {
      const output = dataToString(100000000000n);
      expect(output).toBe("100000000000");
    });

    it("should convert number input to string", () => {
      const output = dataToString(12345);
      expect(output).toBe("12345");
    });

    it("should convert boolean input to string", () => {
      const output = dataToString(true);
      expect(output).toBe("true");
    });

    it("should convert buffer input to string", () => {
      const input = Buffer.from("i am a buffer");
      const output = dataToString(input);
      const expected = toHex(input);
      expect(output).toBe(expected);
    });

    it("should throw on unsupported input types", () => {
      const input = { foo: "bar" };
      expect(() => dataToString(input)).toThrow();
    });
  });
});
