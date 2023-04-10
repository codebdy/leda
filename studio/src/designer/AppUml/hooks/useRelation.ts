import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { relationsState } from "../recoil/atoms";

export function useRelation(uuid: string, appId: ID) {
  const relations = useRecoilValue(relationsState(appId));

  return relations.find((relation) => relation.uuid === uuid);
}
