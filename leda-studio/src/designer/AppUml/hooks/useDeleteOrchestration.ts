import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ID } from "shared";
import { orchestrationsState, selectedElementState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useDeleteOrchestration(appId: ID) {
  const setOrchestrations = useSetRecoilState(orchestrationsState(appId));
  const [selectedElementId, setSelectedDiagram] = useRecoilState(selectedElementState(appId));

  const backupSnapshot = useBackupSnapshot(appId);

  const deleteOrchestration = useCallback(
    (orchestrationUuid: string) => {
      backupSnapshot();
      setOrchestrations((orches) =>
        orches.filter((or) => or.uuid !== orchestrationUuid)
      );

      if (selectedElementId === orchestrationUuid) {
        setSelectedDiagram(undefined)
      }
    },
    [backupSnapshot, selectedElementId, setOrchestrations, setSelectedDiagram]
  );

  return deleteOrchestration;
}
