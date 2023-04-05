import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { codesState } from "../recoil/atoms";

export function useGetCodeByName(appId: ID) {
  const codes = useRecoilValue(codesState(appId));

  const getCodeByName = useCallback((name: string) => {
    return codes.find((code) => code.name === name);
  }, [codes]);

  return getCodeByName;
}
