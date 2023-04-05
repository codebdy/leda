import { Switch } from "antd"
import React, { useCallback } from "react"
import { memo } from "react"
import { IClassAuthConfig } from "model"
import { useUpsertClassAuthConfig } from "../hooks/useUpsertClassAuthConfig";
import { useShowError } from "designer/hooks/useShowError";
import { ID } from "shared";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";

export const ExpandSwitch = memo((
  props: {
    classUuid?: string,
    classConfig?: IClassAuthConfig,
    roleId: ID,
  }
) => {
  const { classUuid, classConfig, roleId } = props;
  const [postClassConfig, { error, loading }] = useUpsertClassAuthConfig();
  useShowError(error)
  const appId = useEdittingAppId();
  const handleChange = useCallback((checked: boolean) => {
    postClassConfig(
      {
        ...classConfig,
        app: {
          sync: {
            id: appId
          },
        },
        classUuid,
        roleId,
        expanded: checked,
      }
    )
  }, [postClassConfig, classConfig, appId, classUuid, roleId])

  return (
    <Switch
      size="small"
      loading={loading}
      checked={classConfig?.expanded}
      onChange={handleChange}
    />
  )
})