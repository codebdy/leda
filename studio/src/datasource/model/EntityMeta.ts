import { AttributeMeta, MethodMeta } from "designer/AppUml/meta";
import { AssociationMeta } from "./AssociationMeta";


export interface EntityMeta {
  uuid: string;
  name: string;
  label?: string;
  packageUuid: string;
  attributes: AttributeMeta[];
  methods: MethodMeta[];
  associations: AssociationMeta[];
  root?: boolean;
}
