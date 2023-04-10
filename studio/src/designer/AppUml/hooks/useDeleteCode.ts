import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ID } from "shared";
import { codesState, selectedElementState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useDeleteCode(appId: ID) {
  const setCodes = useSetRecoilState(codesState(appId));
  const [selectedElementId, setSelectedDiagram] = useRecoilState(selectedElementState(appId));

  const backupSnapshot = useBackupSnapshot(appId);

  const deleteCode = useCallback(
    (codeUuid: string) => {
      backupSnapshot();
      setCodes((codes) =>
        codes.filter((code) => code.uuid !== codeUuid)
      );

      if (selectedElementId === codeUuid){
        setSelectedDiagram(undefined)
      }
    },
    [backupSnapshot, selectedElementId, setCodes, setSelectedDiagram]
  );

  return deleteCode;
}
