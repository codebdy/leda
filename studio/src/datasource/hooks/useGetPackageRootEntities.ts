import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useSelectedAppId } from "plugin-sdk/contexts/desinger";
import { entitiesState } from "../recoil";

export function useGetPackageRootEntities() {
  const appId = useSelectedAppId();
  const entities = useRecoilValue(entitiesState(appId))

  const getPackageEntities = useCallback((packageUuid: string) => {
    return entities?.filter(entity => entity.packageUuid === packageUuid && entity.root) || [];
  }, [entities])

  return getPackageEntities;
}