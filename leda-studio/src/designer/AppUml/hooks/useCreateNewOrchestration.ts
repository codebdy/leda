import { useCallback } from "react";
import { createUuid, ID } from "shared";
import { useBackupSnapshot } from "./useBackupSnapshot";
import { orchestrationsState, selectedElementState, selectedUmlDiagramState } from "../recoil/atoms";
import { useSetRecoilState } from "recoil";
import { useGetOrchestrationByName } from "./useGetOrchestrationByName";
import { OrchestrationMeta } from "../meta/OrchestrationMeta";
import { MethodOperateType, Types } from "../meta";

export function useCreateNewOrchestration(appId: ID) {
  const getByName = useGetOrchestrationByName(appId);
  const backup = useBackupSnapshot(appId);
  const setOrchestrations = useSetRecoilState(orchestrationsState(appId));
  const setSelectedElement = useSetRecoilState(selectedElementState(appId));
  const setSelectedDiagram = useSetRecoilState(
    selectedUmlDiagramState(appId)
  );

  const getNewName = useCallback(() => {
    const prefix = "newOrchestration";
    let index = 1;
    while (getByName(prefix + index)) {
      index++;
    }

    return prefix + index;
  }, [getByName]);

  const createNewOrchestration = useCallback((operateType: MethodOperateType) => {
    backup()
    const newOrchestration: OrchestrationMeta = {
      uuid: createUuid(),
      name: getNewName(),
      script: "",
      operateType,
      type: Types.String,
      args: [],
      typeLabel: "String",
    };
    setOrchestrations(orchestrations => [...orchestrations, newOrchestration]);
    setSelectedElement(newOrchestration.uuid);
    setSelectedDiagram(undefined);
  }, [backup, getNewName, setOrchestrations, setSelectedElement, setSelectedDiagram]);

  return createNewOrchestration;
}
