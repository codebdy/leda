import React, { useCallback, useState } from "react"
import { memo } from "react"
import { ID } from "shared"
import { ListConentLayout } from "common/ListConentLayout"
import { RoleList } from "../RoleList"
import { useTranslation } from "react-i18next"
import { Breadcrumb } from "antd"
import "./style.less"
import { MenuTabs } from "./MenuTabs"
import { useRoleName } from "../hooks/useRoleName"
import { useQueryAppMenus } from "../hooks/useQueryAppMenus"
import { useShowError } from "designer/hooks/useShowError"
import { useQueryMenuAuthConfigs } from "../hooks/useQueryMenuAuthConfigs"

export const MenuAuthBoard = memo(() => {
  const [selectedRoleId, setSelectedRoleId] = useState<ID>();
  const { t } = useTranslation();
  const roleName = useRoleName(selectedRoleId || "");

  const { menus, error } = useQueryAppMenus();
  const { menuConfigs, error: configError } = useQueryMenuAuthConfigs()

  useShowError(error || configError);

  const handleSelectRole = useCallback((selectedRoleId?: ID) => {
    setSelectedRoleId(selectedRoleId)
  }, [])


  return (
    <ListConentLayout
      listWidth={200}
      list={
        <RoleList selectedRoleId={selectedRoleId} onSelect={handleSelectRole} />
      }
    >
      <Breadcrumb className=" auth-breadcrumb">
        <Breadcrumb.Item>{t("Auth.MenuAuth")}</Breadcrumb.Item>
        <Breadcrumb.Item>{roleName}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="menu-auth-content">
        {
          selectedRoleId &&
          <MenuTabs menus={menus || []} roleId={selectedRoleId} menuConfigs={menuConfigs || []} />
        }
      </div>
    </ListConentLayout>
  )
})