import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { RelationType } from "../meta/RelationMeta";
import { relationsState } from "../recoil/atoms";

export function useGetSourceRelations(appId: ID) {
  const relations = useRecoilValue(relationsState(appId));

  const getRelations = useCallback((entityUuid: string,)=>{
    return relations.filter(
      (relation) =>
        relation.sourceId === entityUuid &&
        relation.relationType !== RelationType.INHERIT
    );
  }, [relations])

  return getRelations;
}
