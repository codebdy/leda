import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { orchestrationsState, selectedElementState } from "../recoil/atoms";

export function useSelectedOrcherstration(appId: ID) {
  const selectedElementId = useRecoilValue(selectedElementState(appId));
  const orchestrations = useRecoilValue(orchestrationsState(appId));

  return orchestrations.find((orches) => orches.uuid === selectedElementId);
}
