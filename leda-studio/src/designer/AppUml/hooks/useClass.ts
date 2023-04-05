import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { classesState } from "../recoil/atoms";

export function useClass(uuid: string, appId: ID) {
  const entites = useRecoilValue(classesState(appId));

  return entites.find((cls) => cls.uuid === uuid);
}
