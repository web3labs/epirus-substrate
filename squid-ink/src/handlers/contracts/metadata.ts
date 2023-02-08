/**
 * Helper functions to populate decoded metadata entities.
 *
 * @module handlers/metadata
 */
import { OptEntity } from "handlers/types";
import {
  Activity,
  ContractEvent,
  DecodedActivityArg,
  DecodedContractActivity,
  DecodedContractEvent,
  DecodedEventArg,
} from "../../model";
import { DecodedElement } from "../../abi/types";

/**
 * Creates decoded contracts events with its corresponding
 * arguments from a given decoded element and adds it
 * to the entities array.
 *
 * @param {Object} opts - The options object.
 * @param {OptEntity[]} opts.entities - The entities array.
 * @param {DecodedElement} opts.decodedElement - The decoded element.
 * @param {ContractEvent} opts.contractEventEntity - The contract event.
 */
export function addDecodedEventEntities({
  entities,
  decodedElement,
  contractEventEntity,
}: {
  entities: OptEntity[];
  decodedElement?: DecodedElement;
  contractEventEntity: ContractEvent;
}): void {
  if (decodedElement) {
    const decodedEventEntity = new DecodedContractEvent({
      id: contractEventEntity.id,
      name: decodedElement.name,
      contractEvent: contractEventEntity,
    });

    entities.push(decodedEventEntity);

    for (const arg of decodedElement.args) {
      entities.push(
        new DecodedEventArg({
          id: `${decodedEventEntity.id}-${arg.name}`,
          decodedEvent: decodedEventEntity,
          ...arg,
        })
      );
    }
  }
}

/**
 * Creates decoded activities with its corresponding
 * arguments from a given decoded element and adds it
 * to the entities array.
 *
 * @param {Object} opts - The options object.
 * @param {OptEntity[]} opts.entities - The entities array.
 * @param {DecodedElement} opts.decodedElement - The decoded element.
 * @param {Activity} opts.activityEntity - The activity.
 */
export function addDecodedActivityEntities({
  entities,
  decodedElement,
  activityEntity,
}: {
  entities: OptEntity[];
  decodedElement?: DecodedElement;
  activityEntity: Activity;
}): void {
  if (decodedElement) {
    const decodedElementEntity = new DecodedContractActivity({
      id: activityEntity.id,
      name: decodedElement.name,
      activity: activityEntity,
    });

    entities.push(decodedElementEntity);

    for (const arg of decodedElement.args) {
      entities.push(
        new DecodedActivityArg({
          id: `${decodedElementEntity.id}-${arg.name}`,
          decodedActivity: decodedElementEntity,
          ...arg,
        })
      );
    }
  }
}
