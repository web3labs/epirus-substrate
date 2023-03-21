/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubstrateCall } from "@subsquid/substrate-processor";
import { Account, ActivityType } from "../../model";
import { createActivity, createEvent, createExtrinsic } from "./entities";
import {
  block,
  getMockCall,
  getMockEvent,
  getMockExtrinsic,
  getMockSignature,
} from "../../_mocks";

describe("entities utils", () => {
  let call: SubstrateCall;
  let extrinsicEntity: any;

  beforeEach(() => {
    call = getMockCall({ name: "Contracts.call" });
    extrinsicEntity = {
      id: "0000682013-000002-9ecc4",
      blockNumber: 682013,
      name: "Contracts.call",
      indexInBlock: 2,
      versionInfo: 4,
      hash: "9b1b707b0f5c537afca26d44d0081d29092614e330ff3810d328d0342d6a1845",
      createdAt: new Date("2022-07-21T09:16:54.000000Z"),
      signature:
        "0xa68f6e88a3b3bf5fcf0985d977825e9c1c2971154e16c7332f6441f253c50469c5ebf36682ecce611e45661fa7b12730f4c626fbe1e0f628598045e834e02c8b",
      signer: "5CaRw9VCzZxtnaTjJzWw6NNwi4D9h3yur7akGybuG4wWXaJW",
      tip: null,
      fee: null,
      success: true,
      error: null,
      args: {
        data: "0x00000180ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e000400000000000000000000000000000000",
        dest: {
          __kind: "Id",
          value:
            "0x9d7b986bdfeff1543813431dd9f2298b8ab6af5f62f6ac257fe0e034161c7871",
        },
        gasLimit: 6671999880,
        value: 0,
      },
    };
  });

  describe("createEvent", () => {
    it("should return a new event entity", () => {
      const event = getMockEvent({ name: "Contracts.ContractEmitted" });

      const eventEntity = createEvent(extrinsicEntity, event);
      expect(eventEntity).toBeDefined();
      expect(eventEntity.id).toEqual("0000682013-000004-9ecc4");
      expect(eventEntity.name).toEqual("Contracts.ContractEmitted");
      expect(eventEntity.method).toEqual("Contracts.call");
      expect(eventEntity.params).toEqual({
        contract:
          "0x9d7b986bdfeff1543813431dd9f2298b8ab6af5f62f6ac257fe0e034161c7871",
        data: "0x00000180ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e000400000000000000000000000000000000",
      });
    });
  });

  describe("createExtrinsic", () => {
    it("should return a new extrinsic entity", () => {
      const extrinsic = getMockExtrinsic({ withSignature: true });

      const createdExtrinsicEntity = createExtrinsic(extrinsic, call, block);
      expect(createdExtrinsicEntity).toBeDefined();
      expect(createdExtrinsicEntity).toEqual(extrinsicEntity);
    });

    it("should throw if address __kind is not supported", () => {
      const substrateExtrinsic = getMockExtrinsic({ withSignature: false });
      const signatureTypeIndex = getMockSignature({ addressType: "Index" });
      substrateExtrinsic.signature = signatureTypeIndex;
      expect(() => createExtrinsic(substrateExtrinsic, call, block)).toThrow();
    });
  });

  describe("createActivity", () => {
    it("should return an activity entity", () => {
      const activity = createActivity(
        extrinsicEntity,
        ActivityType.CONTRACTCALL,
        new Account({ id: "5GT6Ttnem54KeRYCgJnE1KSL2GQCtQ1hqYxveXp3z7zzZTrD" })
      );
      expect(activity).toBeDefined();
      expect(activity.id).toEqual("0000682013-000002-9ecc4-CONTRACTCALL");
      expect(activity.type).toEqual("CONTRACTCALL");
      expect(activity.action).toEqual("Contracts.call");
      expect(activity.to).toBeDefined();
      expect(activity.to?.id).toEqual(
        "5GT6Ttnem54KeRYCgJnE1KSL2GQCtQ1hqYxveXp3z7zzZTrD"
      );
    });
  });
});
