import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { ID } from "shared";
import { DiagramMeta } from "../meta/DiagramMeta";
import { diagramsState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useChangeDiagram(appId: ID) {
  const backupSnapshot = useBackupSnapshot(appId);
  const setDiagrams = useSetRecoilState(diagramsState(appId));

  const changeDiagram = useCallback(
    (diagram: DiagramMeta) => {
      backupSnapshot();

      setDiagrams((diagrams) =>
        diagrams.map((dm) => (dm.uuid === diagram.uuid ? diagram : dm))
      );
    },
    [backupSnapshot, setDiagrams]
  );

  return changeDiagram;
}
