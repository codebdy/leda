import { ID } from "shared";
import { useRecoilValue } from 'recoil';
import { orchestrationsState } from "../recoil/atoms";
import { useCallback } from 'react';

export function useIsOrchestration(appId: ID) {
  const orchestrations = useRecoilValue(orchestrationsState(appId))
  const isOrchestration = useCallback((uuid?: string) => {
    return !!orchestrations.find(orches => orches.uuid === uuid)
  }, [orchestrations])

  return isOrchestration
}