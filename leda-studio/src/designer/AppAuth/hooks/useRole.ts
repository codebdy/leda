import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { authRolesState } from "../recoil/atoms";

export function useRole(roleId?: ID) {
  const roles = useRecoilValue(authRolesState);

  const role = useMemo(() => {
    return roles?.find(role => role.id === roleId)
  }, [roles, roleId])

  return role;
}