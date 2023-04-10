import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { ID } from "shared";
import { diagramsState, x6EdgesState, x6NodesState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useDeleteDiagram(appId: ID) {
  const setDiagrams = useSetRecoilState(diagramsState(appId));
  const setNodes = useSetRecoilState(x6NodesState(appId));
  const setEdges = useSetRecoilState(x6EdgesState(appId));

  const backupSnapshot = useBackupSnapshot(appId);

  const deleteDiagram = useCallback(
    (diagramUuid: string) => {
      backupSnapshot();
      setDiagrams((diagrams) =>
        diagrams.filter((diagram) => diagram.uuid !== diagramUuid)
      );
      setNodes((nodes) =>
        nodes.filter((node) => node.diagramUuid !== diagramUuid)
      );

      setEdges((edges) =>
        edges.filter((edge) => edge.diagramUuid !== diagramUuid)
      );
    },
    [backupSnapshot, setDiagrams, setEdges, setNodes]
  );

  return deleteDiagram;
}
