import { NormalisedContractTerminatedEvent } from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import {
  updateAccountBalance,
  createExtrinsic,
  createEvent,
  getOrCreateAccount,
  createActivity,
  saveAll,
} from "../../utils";
import { ActivityType, Contract } from "../../../model";
import { Ctx, Event, EventHandler } from "../../types";

export const contractsTerminatedHandler: EventHandler = {
  name: "Contracts.Terminated",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    const { contract, beneficiary } = new NormalisedContractTerminatedEvent(
      ctx,
      event
    ).resolve();

    log.info({ contract, beneficiary }, "Contract has been terminated");

    const contractEntity = await store.get(Contract, {
      where: { id: contract },
      relations: {
        account: true,
        deployer: true,
        createdFrom: true,
        contractCode: true,
      },
    });
    // Update balances since terminated contract will transfer remaining balance to beneficiary
    const contractAccount = await updateAccountBalance(ctx, contract, block);
    const beneficiaryAccount = await updateAccountBalance(
      ctx,
      beneficiary,
      block
    );

    if (contractEntity === undefined) {
      throw new Error(
        `Contract entity is not found in the database for contract address [${contract}]`
      );
    }

    if (extrinsic && call) {
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const extrinsicSigner = extrinsicEntity.signer
        ? await getOrCreateAccount(store, extrinsicEntity.signer, block)
        : undefined;
      contractEntity.terminatedAt = new Date(block.timestamp);
      contractEntity.terminatedFrom = extrinsicEntity;
      contractEntity.terminationBeneficiary = beneficiaryAccount;
      const activityEntity = createActivity(
        extrinsicEntity,
        ActivityType.CONTRACTTERMINATE,
        contractAccount,
        extrinsicSigner
      );
      await saveAll(store, [
        contractAccount,
        beneficiaryAccount,
        extrinsicSigner,
        extrinsicEntity,
        eventEntity,
        contractEntity,
        activityEntity,
      ]);
    } else {
      log.warn(
        {
          block: block.height,
          name: event.name,
          id: event.id,
          contract,
          beneficiary,
        },
        "No extrinsic or call field in event. Contract terminated info not updated."
      );
      log.debug({ block, event });
    }
  },
};