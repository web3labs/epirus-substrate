import { registry } from "./index";
import { Item } from "./types";

describe("Handler registry", () => {
  it("should resolve event handler", () => {
    const item = {
      kind: "event",
      name: "Contracts.Instantiated",
    } as unknown as Item;
    const handler = registry.resolve(item);
    expect(handler).toBeDefined();
    expect(typeof handler).toBe("function");
  });

  it("should resolve call handler", () => {
    const item = {
      kind: "call",
      name: "Contracts.call",
    } as unknown as Item;
    const handler = registry.resolve(item);
    expect(handler).toBeDefined();
    expect(typeof handler).toBe("function");
  });

  it("should return undefined if event is not handled", () => {
    const item = {
      kind: "event",
      name: "dmpQueue.ExecutedDownward",
    } as unknown as Item;
    const handler = registry.resolve(item);
    expect(handler).toBeUndefined();
  });

  it("should return undefined if call is not handled", () => {
    const item = {
      kind: "call",
      name: "parachainSystem.setValidationData",
    } as unknown as Item;
    const handler = registry.resolve(item);
    expect(handler).toBeUndefined();
  });

  it("should throw if item kind is not supported", () => {
    const item = {
      kind: "handleMe",
      name: "handle.me",
    } as unknown as Item;
    expect(() => registry.resolve(item)).toThrow();
  });
});
