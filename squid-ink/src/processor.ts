import "./initialise";
import { lookupArchive } from "@subsquid/archive-registry";
import { SubstrateBatchProcessor } from "@subsquid/substrate-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import {
  handleBalancesEndowed,
  handleBalancesReserved,
  handleBalancesTransfer,
  handleBalancesWithdraw,
  handleContractCall,
  handleContractCodeStored,
  handleContractCodeUpdated,
  handleContractEmitted,
  handleContractInstantiated,
  handleSystemNewAccount,
} from "./handlers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const processor = new SubstrateBatchProcessor()
  .setBlockRange({ from: 0 })
  .setBatchSize(500)
  .setDataSource({
    chain: process.env.WS_ENDPOINT,
    // Lookup archive by the network name in the Subsquid registry
    archive: lookupArchive("shibuya", { release: "FireSquid" }),

    // Use archive created by archive/docker-compose.yml
    // archive: 'http://localhost:8888/graphql'
  })
  .addEvent("System.NewAccount")
  .addEvent("Balances.Transfer")
  .addEvent("Balances.Withdraw")
  .addEvent("Balances.Reserved")
  .addEvent("Balances.Endowed")
  .addEvent("Contracts.Instantiated")
  .addEvent("Contracts.CodeStored")
  .addEvent("Contracts.ContractCodeUpdated")
  .addEvent("Contracts.ContractEmitted")
  .addCall("Contracts.call");

type ProcessorType = typeof processor;

processor.run(new TypeormDatabase(), async (ctx) => {
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      switch (item.name) {
        case "System.NewAccount":
          await handleSystemNewAccount<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Balances.Transfer":
          await handleBalancesTransfer<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Balances.Withdraw":
          await handleBalancesWithdraw<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Balances.Reserved":
          await handleBalancesReserved<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Balances.Endowed":
          await handleBalancesEndowed<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Contracts.Instantiated":
          await handleContractInstantiated<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Contracts.CodeStored":
          await handleContractCodeStored<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Contracts.ContractCodeUpdated":
          await handleContractCodeUpdated<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Contracts.ContractEmitted":
          await handleContractEmitted<ProcessorType>({
            ctx,
            event: item.event,
            block: block.header,
          });
          break;
        case "Contracts.call":
          await handleContractCall<ProcessorType>({
            ctx,
            call: item.call,
            extrinsic: item.extrinsic,
            block: block.header,
          });
          break;
        default:
          break;
      }
    }
  }
});
