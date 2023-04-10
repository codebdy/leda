import React, { useCallback, useState } from "react"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { ID } from "shared"
import { ListConentLayout } from "common/ListConentLayout"
import { useRoleName } from "../hooks/useRoleName"
import { RoleList } from "../RoleList"
import { Breadcrumb } from "antd"
import "./style.less"
import { useQueryAppPages } from "../hooks/useQueryAppPages"
import { PageTabs } from "./PageTabs"
import { useQueryComponentAuthConfigs } from "../hooks/useQueryComponentAuthConfigs"
import { useShowError } from "designer/hooks/useShowError"
import { useQueryAppPageCagegories } from "../hooks/useQueryAppPageCagegories"

export const PageAuthBoard = memo(() => {
  const [selectedRoleId, setSelectedRoleId] = useState<ID>();
  const { t } = useTranslation();
  const roleName = useRoleName(selectedRoleId||"");
  const { pages, error } = useQueryAppPages();
  const { componentConfigs, error: configError } = useQueryComponentAuthConfigs();
  const { categories, error: categoriesError } = useQueryAppPageCagegories();

  useShowError(error || configError || categoriesError)

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
        <Breadcrumb.Item>{t("Auth.ComponentAuth")}</Breadcrumb.Item>
        <Breadcrumb.Item>{roleName}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="page-auth-content">
        {
          selectedRoleId &&
          <PageTabs
            pages={pages || []} roleId={selectedRoleId}
            compoentConfigs={componentConfigs || []}
            categories={categories || []}
          />
        }
      </div>
    </ListConentLayout>
  )
})