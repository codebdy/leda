import { DownloadOutlined, ImportOutlined, MoreOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Dropdown, Button } from "antd";
import React, { memo, useCallback } from "react"
import { useTranslation } from "react-i18next";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useCreateNewCode } from "../hooks/useCreateNewCode";
import { useCreateNewOrchestration } from "../hooks/useCreateNewOrchestration";
import { MethodOperateType } from "../meta";
import { useExportOrchestrationJson } from "../hooks/useExportOrchestrationJson";
import { useImportOrchestrationJson } from "../hooks/useImportOrchestrationJson";

export const OrchestrationRootAction = memo(() => {
  const appId = useEdittingAppId();

  const expotJson = useExportOrchestrationJson(appId);
  const importJson = useImportOrchestrationJson(appId);
  const { t } = useTranslation();
  const createNewCode = useCreateNewCode(appId);
  const addOrchestration = useCreateNewOrchestration(appId);

  const handleNoneAction = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <Dropdown menu={{
      onClick: (info) => info.domEvent.stopPropagation(),
      items: [
        {
          icon: <PlusSquareOutlined />,
          label: t("AppUml.Add"),
          key: '1',
          onClick: e => e.domEvent.stopPropagation(),
          children: [
            {
              label: t("AppUml.AddQuery"),
              key: '12',
              onClick: e => {
                addOrchestration(MethodOperateType.Query);
              },
            },
            {
              label: t("AppUml.AddMutaion"),
              key: '13',
              onClick: e => {
                addOrchestration(MethodOperateType.Mutation);
              },
            },
            {
              label: t("AppUml.AddCode"),
              key: '11',
              onClick: e => {
                createNewCode();
              }
            },
          ]
        },
        {
          icon: <DownloadOutlined />,
          label: t("AppUml.ExportOrchestration"),
          key: '2',
          onClick: expotJson
        },
        {
          icon: <ImportOutlined />,
          label: t("AppUml.ImportOrchestration"),
          key: '3',
          onClick: importJson,
        },
      ]
    }} trigger={['click']}>
      <Button shape='circle' type="text" size='small' onClick={handleNoneAction}>
        <MoreOutlined />
      </Button>
    </Dropdown>
  )
})
