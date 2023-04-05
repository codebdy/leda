import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ID } from "shared";
import { selectedUmlDiagramState, x6NodesState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useHideClassFromDiagram(appId: ID) {
  const selectedDiagramUuid = useRecoilValue(selectedUmlDiagramState(appId))
  const setNodes = useSetRecoilState(x6NodesState(appId));
  const backupSnapshot = useBackupSnapshot(appId);

  const hideClass = useCallback((classUuid: string) => {
    if (!selectedDiagramUuid) {
      return;
    }
    backupSnapshot();
    setNodes((nodes) => nodes.filter(
      (node) => {
        return !(node.id === classUuid && node.diagramUuid === selectedDiagramUuid)
      }
    ));
  }, [backupSnapshot, selectedDiagramUuid, setNodes]);

  return hideClass
}