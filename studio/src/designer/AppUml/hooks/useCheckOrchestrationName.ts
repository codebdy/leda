import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { orchestrationsState } from "../recoil/atoms";

export function useCheckOrchestrationName(appId: ID) {
  const orchestrations = useRecoilValue(orchestrationsState(appId));

  /**
   * propertyUuid 如果关联性质，为类UUID+关联UUID
   */
  const checkName = useCallback(
    (orchestrationName: string, orchestrationUuid: string) => {
      return !orchestrations.find((ors) => ors.name === orchestrationName && ors.uuid !== orchestrationUuid);
    },
    [orchestrations]
  );

  return checkName;
}
