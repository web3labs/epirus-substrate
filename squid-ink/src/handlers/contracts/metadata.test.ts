import {
  getMockActivityEntity,
  getMockContractEventEntity,
} from "../../_mocks/entities";
import { OptEntity } from "../types";
import {
  addDecodedActivityEntities,
  addDecodedEventEntities,
} from "./metadata";
import { DecodedElement } from "../../abi/types";

describe("addDecodedEventEntities", () => {
  let mockEntities: OptEntity[];
  const mockDecodedEvent: DecodedElement = {
    name: "Transfer",
    args: [
      {
        name: "value",
        type: "Balance",
        value: "888888888000000000000",
        displayName: undefined,
      },
      {
        name: "from",
        type: "Option<AccountId>",
        value: "",
        displayName: undefined,
      },
      {
        name: "to",
        type: "Option<AccountId>",
        value:
          "0x90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22",
        displayName: undefined,
      },
    ],
  };
  const mockContractEventEntity = getMockContractEventEntity();

  beforeEach(() => {
    mockEntities = [];
  });

  it("should create and add decoded event entities if decoded element exists", () => {
    addDecodedEventEntities({
      entities: mockEntities,
      decodedElement: mockDecodedEvent,
      contractEventEntity: mockContractEventEntity,
    });

    expect(mockEntities).toHaveLength(4);
    // Check values of DecodedContractEvent entity
    expect(mockEntities[0]).toHaveProperty("id", mockContractEventEntity.id);
    expect(mockEntities[0]).toHaveProperty("name", "Transfer");
    // Check values of first arg
    expect(mockEntities[1]).toHaveProperty(
      "id",
      `${mockContractEventEntity.id}-value`
    );
    expect(mockEntities[1]).toHaveProperty("name", "value");
    expect(mockEntities[1]).toHaveProperty("type", "Balance");
    expect(mockEntities[1]).toHaveProperty("value", "888888888000000000000");
    expect(mockEntities[1]).toHaveProperty("displayName", undefined);
    // Check values of second arg
    expect(mockEntities[2]).toHaveProperty(
      "id",
      `${mockContractEventEntity.id}-from`
    );
    expect(mockEntities[2]).toHaveProperty("name", "from");
    expect(mockEntities[2]).toHaveProperty("type", "Option<AccountId>");
    expect(mockEntities[2]).toHaveProperty("value", "");
    expect(mockEntities[2]).toHaveProperty("displayName", undefined);
    // Check values of third arg
    expect(mockEntities[3]).toHaveProperty(
      "id",
      `${mockContractEventEntity.id}-to`
    );
    expect(mockEntities[3]).toHaveProperty("name", "to");
    expect(mockEntities[3]).toHaveProperty("type", "Option<AccountId>");
    expect(mockEntities[3]).toHaveProperty(
      "value",
      "0x90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22"
    );
    expect(mockEntities[3]).toHaveProperty("displayName", undefined);
  });

  it("should not add any entities if decoded element does not exist", () => {
    addDecodedEventEntities({
      entities: mockEntities,
      decodedElement: undefined,
      contractEventEntity: mockContractEventEntity,
    });

    expect(mockEntities).toHaveLength(0);
  });
});

describe("addDecodedActivityEntities", () => {
  let mockEntities: OptEntity[];
  const mockDecodedActivity: DecodedElement = {
    name: "new",
    args: [
      {
        name: "totalSupply",
        type: "Balance",
        value: "888888888000000000000",
        displayName: undefined,
      },
    ],
  };
  const mockContractActivityEntity = getMockActivityEntity();

  beforeEach(() => {
    mockEntities = [];
  });

  it("should create and add decoded activity entities if decoded element exists", () => {
    addDecodedActivityEntities({
      entities: mockEntities,
      decodedElement: mockDecodedActivity,
      activityEntity: mockContractActivityEntity,
    });

    expect(mockEntities).toHaveLength(2);
    // Check values of DecodedActivity entity
    expect(mockEntities[0]).toHaveProperty("id", mockContractActivityEntity.id);
    expect(mockEntities[0]).toHaveProperty("name", "new");
    // Check values of first arg
    expect(mockEntities[1]).toHaveProperty(
      "id",
      `${mockContractActivityEntity.id}-totalSupply`
    );
    expect(mockEntities[1]).toHaveProperty("name", "totalSupply");
    expect(mockEntities[1]).toHaveProperty("type", "Balance");
    expect(mockEntities[1]).toHaveProperty("value", "888888888000000000000");
    expect(mockEntities[1]).toHaveProperty("displayName", undefined);
  });

  it("should not add any entities if decoded element does not exist", () => {
    addDecodedActivityEntities({
      entities: mockEntities,
      decodedElement: undefined,
      activityEntity: mockContractActivityEntity,
    });

    expect(mockEntities).toHaveLength(0);
  });
});
