import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GUEST_ROLE_ID } from "consts";
import { useParseLangMessage } from "plugin-sdk";
import { ID } from "shared";
import { useRole } from "./useRole";

export function useRoleName(roleId: ID) {
  const role = useRole(roleId);
  const p = useParseLangMessage();
  const { t } = useTranslation();

  const roleName = useMemo(() => {
    if (role?.name) {
      return p(role.name);
    }

    if (roleId === GUEST_ROLE_ID) {
      return t("Auth.Guest");
    }
  }, [p, role?.name, roleId, t])

  return roleName;
}