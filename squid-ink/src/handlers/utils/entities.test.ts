/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
  SubstrateExtrinsicSignature,
} from "@subsquid/substrate-processor";
import { Account, ActivityType } from "../../model";
import { Event } from "../types";
import { createActivity, createEvent, createExtrinsic } from "./entities";

describe("entities utils", () => {
  let block: SubstrateBlock;
  let extrinsic: SubstrateExtrinsic;
  let signature: SubstrateExtrinsicSignature;
  let call: SubstrateCall;
  let extrinsicEntity: any;
  let event: Event;

  beforeEach(() => {
    block = {
      id: "682013-9ecc4",
      height: 682013,
      hash: "0x9ecc4cba937ddb8fd6b28b47b8f1c86fc4d03425881770c43ca4928841191f5f",
      parentHash:
        "0x239e3b7ba93cbfef4f8f36cd76d5b9ce7bd4a73e125815f3390e1ab860d2a48d",
      timestamp: 1658395014000,
      specId: "",
    };

    call = {
      id: "0000682013-000002-9ecc4",
      name: "Contracts.call",
      args: {
        data: "0xcfdd9aa2328b9524fa3a658575a8a0b32893c82768daddb1ff0a1fa80a84b81ff9f3d018",
        dest: {
          __kind: "Id",
          value:
            "0xc2046f8d86ed5cba648a73505758ee37c695a94c7438de01ef1190a7e95e91d0",
        },
        gasLimit: 20677883868,
        value: 0,
      },
      success: true,
      error: null,
      pos: 19,
    };

    signature = {
      address: {
        __kind: "Id",
        value:
          "0x16abc2e17fa70aee7cad18c78dc584866590b795fdb78952c0901b5d94a00a69",
      },
      signature: {
        __kind: "Sr25519",
        value:
          "0xa68f6e88a3b3bf5fcf0985d977825e9c1c2971154e16c7332f6441f253c50469c5ebf36682ecce611e45661fa7b12730f4c626fbe1e0f628598045e834e02c8b",
      },
      signedExtensions: {
        ChargeTransactionPayment: 0,
        CheckMortality: {
          __kind: "Mortal196",
          value: 1,
        },
        CheckNonce: 2,
      },
    };

    extrinsic = {
      id: "0000682013-000002-9ecc4",
      indexInBlock: 2,
      version: 4,
      signature,
      call,
      fee: undefined,
      tip: BigInt(0),
      success: true,
      error: null,
      hash: "0xd67448c72dabbb64e06793c954727b06ad02a59be0ed2c5b82aa2cc3232a38c4",
      pos: 19,
    };

    event = {
      id: "0000682013-000004-9ecc4",
      name: "Contracts.ContractEmitted",
      indexInBlock: 4,
      call,
      extrinsic,
      args: {
        contract:
          "0x9d7b986bdfeff1543813431dd9f2298b8ab6af5f62f6ac257fe0e034161c7871",
        data: "0x00000180ac219f52c23249cb84df10ad26c6f38898b500811e4093c20ade5be28e000400000000000000000000000000000000",
      },
    };

    extrinsicEntity = {
      id: "0000682013-000002-9ecc4",
      blockNumber: 682013,
      name: "Contracts.call",
      indexInBlock: 2,
      versionInfo: 4,
      hash: "0xd67448c72dabbb64e06793c954727b06ad02a59be0ed2c5b82aa2cc3232a38c4",
      createdAt: new Date("2022-07-21T09:16:54.000000Z"),
      signature:
        "0xa68f6e88a3b3bf5fcf0985d977825e9c1c2971154e16c7332f6441f253c50469c5ebf36682ecce611e45661fa7b12730f4c626fbe1e0f628598045e834e02c8b",
      signer: "5CaRw9VCzZxtnaTjJzWw6NNwi4D9h3yur7akGybuG4wWXaJW",
      tip: null,
      fee: null,
      success: true,
      error: null,
      args: {
        data: "0xcfdd9aa2328b9524fa3a658575a8a0b32893c82768daddb1ff0a1fa80a84b81ff9f3d018",
        dest: {
          __kind: "Id",
          value:
            "0xc2046f8d86ed5cba648a73505758ee37c695a94c7438de01ef1190a7e95e91d0",
        },
        gasLimit: 20677883868,
        value: 0,
      },
    };
  });

  describe("createEvent", () => {
    it("should return a new event entity", () => {
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
      const createdExtrinsicEntity = createExtrinsic(extrinsic, call, block);
      expect(createdExtrinsicEntity).toBeDefined();
      expect(createdExtrinsicEntity).toEqual(extrinsicEntity);
    });

    it("should throw if address __kind is not supported", () => {
      const substrateExtrinsic = {
        id: "0000682013-000002-9ecc4",
        indexInBlock: 2,
        version: 4,
        signature: {
          address: {
            __kind: "Index",
            value:
              "0x16abc2e17fa70aee7cad18c78dc584866590b795fdb78952c0901b5d94a00a69",
          },
          signature: {},
          signedExtensions: {},
        },
        call,
        fee: undefined,
        tip: BigInt(0),
        success: true,
        error: null,
        hash: "0xd67448c72dabbb64e06793c954727b06ad02a59be0ed2c5b82aa2cc3232a38c4",
        pos: 19,
      };
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
