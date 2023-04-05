import { useCallback } from "react";
import { useCreateNewClass } from "./useCreateNewClass";
import { NODE_INIT_SIZE } from "../GraphCanvas/nodeInitSize";
import { StereoType } from "../meta/ClassMeta";
import { ID } from "shared";
import { useSelectedDiagramPackageUuid } from "./useSelectedDiagramPackageUuid";

export function useCreateTempClassNodeForNew(appId: ID) {
  const packageUuid = useSelectedDiagramPackageUuid(appId)
  const creatNewClassMeta = useCreateNewClass(appId);
  const createTempClassNodeForNew = useCallback(
    (stereoType: StereoType) => {
      if (!packageUuid) {
        return
      }
      const classMeta = creatNewClassMeta(stereoType, packageUuid);
      if (
        stereoType === StereoType.ValueObject ||
        stereoType === StereoType.Enum
      ) {
        classMeta.methods = [];
      }
      return {
        uuid: "entityMeta.uuid",
        ...NODE_INIT_SIZE,

        shape: "class-node",
        data: {
          ...classMeta,
          //root: stereoType === StereoType.Partial,
          isTempForNew: true,
        },
      };
    },
    [creatNewClassMeta, packageUuid]
  );
  return createTempClassNodeForNew;
}
