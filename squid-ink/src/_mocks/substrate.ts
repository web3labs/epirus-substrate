/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExtrinsicSignature } from "@subsquid/substrate-metadata";
import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import { Event } from "handlers/types";
import {
  addressTypeId,
  addressTypeIndex,
  addressTypeUnknown,
  CONTRACT_ACCOUNT,
  DATA_EMITTED,
  EOA_ACCOUNT,
  OLD_CODE_HASH,
  NEW_CODE_HASH,
  AMOUNT,
} from "./constants";
import { AddressTypes, CallTypes, EventTypes, MultiAddress } from "./types";

export const block: SubstrateBlock = {
  id: "682013-9ecc4",
  height: 682013,
  hash: "0x9ecc4cba937ddb8fd6b28b47b8f1c86fc4d03425881770c43ca4928841191f5f",
  parentHash:
    "0x239e3b7ba93cbfef4f8f36cd76d5b9ce7bd4a73e125815f3390e1ab860d2a48d",
  timestamp: 1658395014000,
  extrinsicsRoot: "0x0",
  stateRoot: "0x0",
  specId: "",
};

/**
 *
 * @param param0
 * @returns
 */
export function getMockSignature({
  addressType = "Id",
}: {
  addressType: AddressTypes;
}): ExtrinsicSignature {
  const signature = {
    address: getAddressByType(addressType),
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
  return signature;
}

function getAddressByType(type: AddressTypes): MultiAddress {
  switch (type) {
    case "Id":
      return addressTypeId;
    case "Index":
      return addressTypeIndex;
    default:
      return addressTypeUnknown;
  }
}

export function getMockCall({ name }: { name: CallTypes }): SubstrateCall {
  return {
    id: "0000682013-000002-9ecc4",
    name,
    args: getCallArgsByType(name),
    success: true,
    error: null,
    pos: 19,
  };
}

export function getMockExtrinsic({
  withSignature = true,
}: {
  withSignature: boolean;
}): SubstrateExtrinsic {
  return {
    id: "0000682013-000002-9ecc4",
    indexInBlock: 2,
    version: 4,
    signature: withSignature
      ? getMockSignature({ addressType: "Id" })
      : undefined,
    call: getMockCall({ name: "Contracts.call" }),
    fee: undefined,
    tip: BigInt(0),
    success: true,
    error: null,
    hash: "9b1b707b0f5c537afca26d44d0081d29092614e330ff3810d328d0342d6a1845",
    pos: 19,
  };
}

export function getMockEvent({
  name,
  withCall = true,
  withExtrinsic = true,
}: {
  name: EventTypes;
  withCall?: boolean;
  withExtrinsic?: boolean;
}): Event {
  return {
    id: "0000682013-000004-9ecc4",
    name,
    pos: 4,
    call: withCall ? getMockCall({ name: "Contracts.call" }) : undefined,
    extrinsic: withExtrinsic
      ? getMockExtrinsic({ withSignature: false })
      : undefined,
    args: getEventArgsByType(name),
  };
}

function getEventArgsByType(type: EventTypes): any {
  switch (type) {
    case "Contracts.ContractEmitted":
      return {
        contract: CONTRACT_ACCOUNT,
        data: DATA_EMITTED,
      };
    case "Contracts.Instantiated":
      return {
        contract: CONTRACT_ACCOUNT,
        deployer: EOA_ACCOUNT,
      };
    case "Contracts.CodeStored":
    case "Contracts.CodeRemoved":
      return {
        codeHash: OLD_CODE_HASH,
      };
    case "Contracts.ContractCodeUpdated":
      return {
        contract: CONTRACT_ACCOUNT,
        newCodeHash: NEW_CODE_HASH,
        oldCodeHash: OLD_CODE_HASH,
      };
    case "Contracts.Terminated":
      return {
        beneficiary: EOA_ACCOUNT,
        contract: CONTRACT_ACCOUNT,
      };
    case "Balances.Transfer":
      return {
        amount: AMOUNT,
        from: EOA_ACCOUNT,
        to: CONTRACT_ACCOUNT,
      };
    case "Balances.Withdraw":
    case "Balances.Reserved":
      return {
        amount: AMOUNT,
        who: EOA_ACCOUNT,
      };
    case "Balances.Endowed":
      return {
        account: EOA_ACCOUNT,
        freeBalance: AMOUNT,
      };
    case "System.NewAccount":
      return {
        account: EOA_ACCOUNT,
      };
    default:
      return {};
  }
}

function getCallArgsByType(type: CallTypes): any {
  switch (type) {
    case "Contracts.call":
      return {
        dest: {
          __kind: "Id",
          value: CONTRACT_ACCOUNT,
        },
        value: 0,
        gasLimit: AMOUNT,
        data: DATA_EMITTED,
      };
    case "Contracts.instantiate_with_code":
      return {
        code: "0x",
        data: DATA_EMITTED,
        gasLimit: AMOUNT,
        salt: "0x80615ff53d23697eb2859dee2e1a11696eeab825905d4131b08a4d292c72f383bf",
        storageDepositLimit: AMOUNT,
        value: 0,
      };
    default:
      return {};
  }
}
