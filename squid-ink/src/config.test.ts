import { config } from "./config";

describe("processor configuration", () => {
  test("block range from value should be set", () => {
    expect(config.blockRange.from).toBeDefined();
    expect(config.blockRange.from).toEqual(0);
  });
  test("batch size should be set", () => {
    expect(typeof config.batchSize).toBe("number");
    expect(config.batchSize).toEqual(500);
  });
  test("data source should be set", () => {
    expect(config.dataSource.chain).toBeDefined();
    expect(typeof config.dataSource.chain).toBe("string");
    expect(config.dataSource.archive).toBeDefined();
    expect(typeof config.dataSource.archive).toBe("string");
  });
});
