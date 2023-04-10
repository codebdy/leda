import { atomFamily } from "recoil";
import { PackageMeta, ClassMeta } from "designer/AppUml/meta";

import { EntityMeta } from "../model/EntityMeta";

export const packagesState = atomFamily<PackageMeta[], string>({
  key: "designer.packages",
  default: [],
})

export const classesState = atomFamily<ClassMeta[], string>({
  key: "designer.classes",
  default: [],
})

export const entitiesState = atomFamily<EntityMeta[], string>({
  key: "designer.entities",
  default: [],
})
