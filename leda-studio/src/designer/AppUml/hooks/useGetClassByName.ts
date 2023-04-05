import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { classesState } from "../recoil/atoms";

export function useGetClassByName(appId: ID) {
  const entites = useRecoilValue(classesState(appId));

  const getClassByName = useCallback((name: string) => {
    return entites.find((ent) => ent.name === name);
  }, [entites]);

  return getClassByName;
}
