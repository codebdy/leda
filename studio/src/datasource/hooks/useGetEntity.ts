import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useSelectedAppId } from "plugin-sdk/contexts/desinger";
import { entitiesState } from "../recoil";

export function useGetEntity() {
  const appId = useSelectedAppId();
  const entities = useRecoilValue(entitiesState(appId))

  const getEntity = useCallback((enitityUuid?: string) => {
    return entities.find(entity => entity.uuid === enitityUuid);
  }, [entities])

  return getEntity
}