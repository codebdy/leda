import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import {  orchestrationsState } from "../recoil/atoms";

export function useGetOrchestrationByName(appId: ID) {
  const orchestrations = useRecoilValue(orchestrationsState(appId));

  const getOrchestrationByName = useCallback((name: string) => {
    return orchestrations.find((orchestration) => orchestration.name === name);
  }, [orchestrations]);

  return getOrchestrationByName;
}
