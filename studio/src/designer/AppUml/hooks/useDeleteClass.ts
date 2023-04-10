import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ID } from "shared";
import {
  classesState,
  relationsState,
  x6EdgesState,
  x6NodesState,
} from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useDeleteClass(appId: ID) {
  const setEntites = useSetRecoilState(classesState(appId));
  const [relations, setRelations] = useRecoilState(relationsState(appId));
  const setNodes = useSetRecoilState(x6NodesState(appId));
  const setEdges = useSetRecoilState(x6EdgesState(appId));

  const backupSnapshot = useBackupSnapshot(appId);

  const deleteClasses = useCallback(
    (classUuid: string) => {
      backupSnapshot();
      setEntites((clses) =>
        clses.filter((entity) => entity.uuid !== classUuid)
      );
      const relationIds = relations
        .filter(
          (relation) =>
            relation.sourceId === classUuid || relation.targetId === classUuid
        )
        .map((relation) => relation.uuid);
      setRelations((relations) =>
        relations.filter((relation) => !relationIds.find(uuid=>relation.uuid === uuid))
      );

      setNodes((nodes) => nodes.filter((node) => node.id !== classUuid));

      setEdges((edges) => edges.filter((edge) => !(edge.id in relationIds)));
    },
    [backupSnapshot, relations, setEdges, setEntites, setNodes, setRelations]
  );

  return deleteClasses;
}
