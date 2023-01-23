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
 *
 * @param param0
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
 *
 * @param param0
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
