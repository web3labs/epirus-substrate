// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-classes-per-file */
import { ContractsContractCodeUpdatedEvent } from "@chain/types/events";
import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import {
  ResolvedBalancesEndowedEvent,
  ResolvedBalancesReservedEvent,
  ResolvedBalancesTransferEvent,
  ResolvedBalancesWithdrawEvent,
  ResolvedContractCodeRemovedEvent,
  ResolvedContractEmittedEvent,
  ResolvedContractsCodeStoredEvent,
  ResolvedContractsCodeUpdatedEvent,
  ResolvedContractsInstantiatedEvent,
  ResolvedContractTerminatedEvent,
  ResolvedNewAccountEvent,
} from "chains/normalised-return-types";
import { ss58Format } from "../../../chain-config";
import {
  BalancesEndowedEvent,
  BalancesReservedEvent,
  BalancesTransferEvent,
  BalancesWithdrawEvent,
  ContractsCodeRemovedEvent,
  ContractsCodeStoredEvent,
  ContractsContractEmittedEvent,
  ContractsInstantiatedEvent,
  ContractsTerminatedEvent,
  SystemNewAccountEvent,
} from "../types/events";

export class NormalisedBalancesTransferEvent extends BalancesTransferEvent {
  resolve(): ResolvedBalancesTransferEvent {
    if(this.isV12) {
      const { from, to, amount } = this.asV12;
      return {
        from: ss58.codec(ss58Format).encode(from), 
        to: ss58.codec(ss58Format).encode(to),
        amount
      }
    }
    throw new Error(
      "No runtime version found while decoding [BalancesTransferEvent]"
    );
  }
}

export class NormalisedBalancesEndowedEvent extends BalancesEndowedEvent {
  resolve(): ResolvedBalancesEndowedEvent {
    if(this.isV12) {
      const { account, freeBalance } = this.asV12;
      return {
        account: ss58.codec(ss58Format).encode(account),
        freeBalance,
      };
    }
    throw new Error(
      "No runtime version found while decoding [BalancesEndowedEvent]"
    );
  }
}

export class NormalisedBalancesWithdrawEvent extends BalancesWithdrawEvent {
  resolve(): ResolvedBalancesWithdrawEvent {
    if (this.isV12) {
      const { who, amount } = this.asV12;
      return {
        account: ss58.codec(ss58Format).encode(who),
        amount,
      };
    }
    throw new Error(
      "No runtime version found while decoding [BalancesWithdrawEvent]"
    );
  }
}

export class NormalisedBalancesReservedEvent extends BalancesReservedEvent {
  resolve(): ResolvedBalancesReservedEvent {
    if (this.isV12) {
      const { who, amount } = this.asV12;
      return {
        account: ss58.codec(ss58Format).encode(who),
        amount,
      };
    }
    throw new Error(
      "No runtime version found while decoding [BalancesReservedEvent]"
    );
  }
}

export class NormalisedContractsCodeRemovedEvent extends ContractsCodeRemovedEvent {
  resolve(): ResolvedContractCodeRemovedEvent {
    if (this.isV20) {
      const { codeHash } = this.asV20;
      return { codeHash: toHex(codeHash) };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsCodeRemovedEvent]"
    );
  }
}

export class NormalisedContractsInstantiatedEvent extends ContractsInstantiatedEvent {
  resolve(): ResolvedContractsInstantiatedEvent {
    if (this.isV20) {
      const { deployer, contract } = this.asV20;
      return {
        deployer: ss58.codec(ss58Format).encode(deployer),
        contract: ss58.codec(ss58Format).encode(contract),
      };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsInstantiatedEvent]"
    );
  }
}

export class NormalisedContractsCodeStoredEvent extends ContractsCodeStoredEvent {
  resolve(): ResolvedContractsCodeStoredEvent {
    if (this.isV20) {
      const { codeHash } = this.asV20;
      return { codeHash: toHex(codeHash) };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsCodeStoredEvent]"
    );
  }
}

export class NormalisedContractsCodeUpdatedEvent extends ContractsContractCodeUpdatedEvent {
  resolve(): ResolvedContractsCodeUpdatedEvent {
    if (this.isV100) {
      const { contract, newCodeHash, oldCodeHash } = this.asV100;
      return {
        contract: ss58.codec(ss58Format).encode(contract),
        newCodeHash: toHex(newCodeHash),
        oldCodeHash: toHex(oldCodeHash),
      };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsContractCodeUpdatedEvent]"
    );
  }
}

export class NormalisedContractEmittedEvent extends ContractsContractEmittedEvent {
  resolve(): ResolvedContractEmittedEvent {
    if (this.isV20) {
      const { contract, data } = this.asV20;
      return { contract: ss58.codec(ss58Format).encode(contract), data };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsContractEmittedEvent]"
    );
  }
}

export class NormalisedContractTerminatedEvent extends ContractsTerminatedEvent {
  resolve(): ResolvedContractTerminatedEvent {
    if (this.isV20) {
      const { contract, beneficiary } = this.asV20;
      return {
        contract: ss58.codec(ss58Format).encode(contract),
        beneficiary: ss58.codec(ss58Format).encode(beneficiary),
      };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsTerminatedEvent]"
    );
  }
}

export class NormalisedSystemNewAccountEvent extends SystemNewAccountEvent {
  resolve(): ResolvedNewAccountEvent {
    if (this.isV12) {
      return { account: ss58.codec(ss58Format).encode(this.asV12) };
    }
    if (this.isV20) {
      const { account } = this.asV20;
      return { account: ss58.codec(ss58Format).encode(account) };
    }
    throw new Error(
      "No runtime version found while decoding [SystemNewAccountEvent]"
    );
  }
}
