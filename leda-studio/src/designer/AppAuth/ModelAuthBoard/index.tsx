import React, { useCallback, useState } from "react"
import { memo } from "react"
import { ListConentLayout } from "common/ListConentLayout"
import { ModelTable } from "./ModelTable"
import { RoleList } from "../RoleList"
import "./style.less"
import { Breadcrumb, Spin } from "antd"
import { useTranslation } from "react-i18next"
import { ID } from "shared"
import { useQueryClassAuthConfigs } from "../hooks/useQueryClassAuthConfigs"
import { useQueryPropertyAuthConfigs } from "../hooks/useQueryPropertyAuthConfigs"
import { useShowError } from "designer/hooks/useShowError"
import { useRoleName } from "../hooks/useRoleName"

export const ModelAuthBoard = memo(() => {
  const [selectedRoleId, setSelectedRoleId] = useState<ID>();
  const { t } = useTranslation();
  const roleName = useRoleName(selectedRoleId || "");
  const { classAuthConfigs, error, loading } = useQueryClassAuthConfigs();
  const { propertyAuthConfigs, error: propertyEror, loading: propertyLoading } = useQueryPropertyAuthConfigs();

  useShowError(error || propertyEror)

  const handleSelectRole = useCallback((selectedRoleId?: ID) => {
    setSelectedRoleId(selectedRoleId)
  }, [])

  return (
    <Spin spinning={loading || propertyLoading}>
      <ListConentLayout
        listWidth={200}
        list={
          <RoleList selectedRoleId={selectedRoleId} onSelect={handleSelectRole} />
        }
      >
        <Breadcrumb className="auth-breadcrumb">
          <Breadcrumb.Item>{t("Auth.ModelAuth")}</Breadcrumb.Item>
          <Breadcrumb.Item>{roleName}</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ flex: 1, overflow: "auto" }}>
          {
            selectedRoleId &&
            <ModelTable
              classConfigs={classAuthConfigs || []}
              propertyConfigs={propertyAuthConfigs || []}
              roleId={selectedRoleId}
            />
          }
        </div>
      </ListConentLayout>
    </Spin>
  )
})