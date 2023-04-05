import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { RelationType } from "../meta/RelationMeta";
import { relationsState } from "../recoil/atoms";

export function useGetFirstParentUuids(appId: ID) {
  const relations = useRecoilValue(relationsState(appId));
  const getParentUuid = useCallback(
    (uuid: string) => {
      const uuids: string[] = [];
      for(const relation of relations){
        if(relation.sourceId === uuid &&
          relation.relationType === RelationType.INHERIT){
            uuids.push(relation.targetId)
          }
      }
      return uuids
    },
    [relations]
  );

  return getParentUuid;
}
