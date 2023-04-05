import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { relationsState } from "../recoil/atoms";

export function useGetRelation(appId: ID) {
  const relations = useRecoilValue(relationsState(appId));

  const getRelation = useCallback((uuid: string) => {
    return relations.find((relation) => relation.uuid === uuid);
  }, [relations]);

  return getRelation;
}
