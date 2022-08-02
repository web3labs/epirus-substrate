import { registry } from "./index";

describe("Handler registry", () => {
  it("should register all event handlers", () => {
    const eventHandlerNames = registry.eventNames;
    expect(eventHandlerNames).toHaveLength(11);
    expect(eventHandlerNames).toEqual([
      "Balances.Transfer",
      "Balances.Withdraw",
      "Balances.Reserved",
      "Balances.Endowed",
      "Contracts.Instantiated",
      "Contracts.ContractEmitted",
      "Contracts.ContractCodeUpdated",
      "Contracts.CodeStored",
      "Contracts.CodeRemoved",
      "Contracts.Terminated",
      "System.NewAccount",
    ]);
  });

  it("should register all call handlers", () => {
    const eventHandlerNames = registry.callNames;
    expect(eventHandlerNames).toHaveLength(1);
    expect(eventHandlerNames).toEqual(["Contracts.call"]);
  });

  it("should resolve event handler", () => {
    const item = {
      kind: "event",
      name: "Contracts.Instantiated",
    };
    const handler = registry.resolve(item);
    expect(handler).toBeDefined();
    expect(typeof handler).toBe("function");
  });

  it("should resolve call handler", () => {
    const item = {
      kind: "call",
      name: "Contracts.call",
    };
    const handler = registry.resolve(item);
    expect(handler).toBeDefined();
    expect(typeof handler).toBe("function");
  });

  it("should return undefined if event is not handled", () => {
    const item = {
      kind: "event",
      name: "dmpQueue.ExecutedDownward",
    };
    const handler = registry.resolve(item);
    expect(handler).toBeUndefined();
  });

  it("should return undefined if call is not handled", () => {
    const item = {
      kind: "call",
      name: "parachainSystem.setValidationData",
    };
    const handler = registry.resolve(item);
    expect(handler).toBeUndefined();
  });

  it("should throw if item kind is not supported", () => {
    const item = {
      kind: "handleMe",
      name: "handle.me",
    };
    expect(() => registry.resolve(item)).toThrow();
  });
});
