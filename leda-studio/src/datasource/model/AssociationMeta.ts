import { AssociationType } from "./IFieldSource";

export interface AssociationMeta {
  name: string;
  label?: string;
  typeUuid: string;
  associationType: AssociationType,
}
