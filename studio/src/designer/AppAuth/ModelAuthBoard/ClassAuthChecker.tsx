import { Button, Checkbox } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { memo } from "react"
import { IClassAuthConfig } from "model"
import { useUpsertClassAuthConfig } from "../hooks/useUpsertClassAuthConfig";
import { useShowError } from "designer/hooks/useShowError";
import { ID } from "shared";
import { FunctionOutlined, LoadingOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ExpressionModal } from "./ExpressionModal";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";

export const ClassAuthChecker = memo((
  props: {
    classUuid?: string,
    classConfig?: IClassAuthConfig,
    roleId: ID,
    field: string,
    expressionField: string,
  }
) => {
  const { classUuid, classConfig, roleId, field, expressionField } = props;
  const [open, setOpen] = useState<boolean>();
  const appId = useEdittingAppId();
  const [checked, setChecked] = useState(false);
  const [postClassConfig, { error, loading }] = useUpsertClassAuthConfig({
    onCompleted: () => {
      setOpen(false);
    }
  });
  useShowError(error)

  useEffect(() => {
    setChecked((classConfig as any)?.[field])
  }, [classConfig, field])

  const handleChange = useCallback((e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
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
        [field]: e.target.checked,
      }
    )
  }, [postClassConfig, classConfig, appId, classUuid, roleId, field])

  const handleOpenExpressionDialog = useCallback(() => {
    setOpen(true);
  }, [])

  const handleOpenChange = useCallback((open?: boolean) => {
    setOpen(open);
  }, [])

  const handleExrpessionChange = useCallback((expression?: string) => {
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
        [expressionField]: expression,
      }
    )
  }, [postClassConfig, classConfig, appId, classUuid, roleId, expressionField])

  return (
    <>
      {
        loading
          ? <LoadingOutlined />
          : <Checkbox
            checked={checked}
            onChange={handleChange}
          />
      }
      {
        (classConfig as any)?.[field] &&
        <>
          <Button
            type="text"
            shape="circle"
            icon={<FunctionOutlined />}
            onClick={handleOpenExpressionDialog}
          />
          {
            open &&
            <ExpressionModal
              value={(classConfig as any)?.[expressionField]}
              open={open}
              onOpenChange={handleOpenChange}
              saving={loading}
              onChange={handleExrpessionChange}
            />
          }
        </>
      }

    </>
  )
})