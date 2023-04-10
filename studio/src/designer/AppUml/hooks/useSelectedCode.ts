import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { codesState, selectedElementState } from "../recoil/atoms";

export function useSelectedCode(appId: ID) {
  const selectedElementId = useRecoilValue(selectedElementState(appId));
  const codes = useRecoilValue(codesState(appId));

  return codes.find((code) => code.uuid === selectedElementId);
}
