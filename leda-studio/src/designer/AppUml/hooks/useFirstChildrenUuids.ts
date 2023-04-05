import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { RelationType } from "../meta/RelationMeta";
import { relationsState } from "../recoil/atoms";

export function useFirstChildrenUuids(uuid: string, appId: ID) {
  const relations = useRecoilValue(relationsState(appId));

  const children: string[] = [];
  for (const relation of relations) {
    if (
      relation.targetId === uuid &&
      relation.relationType === RelationType.INHERIT
    ) {
      children.push(relation.sourceId);
    }
  }
  return children;
}
