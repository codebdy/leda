import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { relationsState, selectedElementState } from "../recoil/atoms";

export function useSelectedRelation(appId: ID) {
  const selectedElement = useRecoilValue(selectedElementState(appId));
  const relations = useRecoilValue(relationsState(appId));

  return relations.find((relation) => relation.uuid === selectedElement);
}
