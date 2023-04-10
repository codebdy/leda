import { useRecoilValue } from "recoil";
import { authRolesState } from "../recoil/atoms";

export function useRoles(){
  return useRecoilValue(authRolesState);
}