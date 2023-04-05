import { FolderAddOutlined, DownloadOutlined, ImportOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Button } from "antd";
import React, { memo, useCallback, useState } from "react"
import { useCreateNewPackage } from '../hooks/useCreateNewPackage';
import { useSetRecoilState } from 'recoil';
import { packagesState } from "../recoil/atoms";
import { useBackupSnapshot } from "../hooks/useBackupSnapshot";
import { useExportModelJson } from "../hooks/useExportModelJson";
import { useTranslation } from "react-i18next";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { PackageDialog } from "./PackageLabel/PackageDialog";
import { PackageMeta } from "../meta/PackageMeta";
import { useImportModelJson } from "../hooks/useImportModelJson";

export const ModelRootAction = memo(() => {
  const appId = useEdittingAppId();
  const [newPackage, setNewPackage] = useState<PackageMeta>();
  const setPackages = useSetRecoilState(packagesState(appId));
  const createNewPackage = useCreateNewPackage(appId);
  const backup = useBackupSnapshot(appId);
  const expotJson = useExportModelJson(appId);
  const importJson = useImportModelJson(appId);
  const { t } = useTranslation();

  const handleNoneAction = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handleAddPackage = useCallback(
    () => {
      setNewPackage(createNewPackage());
    },
    [createNewPackage],
  );

  const handleClose = useCallback(() => {
    setNewPackage(undefined);
  }, [])

  const handleConfirm = useCallback((pkg: PackageMeta) => {
    backup();
    setPackages(packages => [...packages, pkg]);
    setNewPackage(undefined);
  }, [backup, setPackages])

  return (
    <>
      <Dropdown
        menu={{
          onClick: (info) => info.domEvent.stopPropagation(),
          items: [
            {
              icon: <FolderAddOutlined />,
              label: t("AppUml.AddPackage"),
              key: '0',
              onClick: e => {
                e.domEvent.stopPropagation();
                handleAddPackage();
              }
            },
            {
              icon: <DownloadOutlined />,
              label: t("AppUml.ExportModel"),
              key: '1',
              onClick: expotJson
            },
            {
              icon: <ImportOutlined />,
              label: t("AppUml.ImportModel"),
              key: '2',
              onClick: importJson,
            },
          ]
        }}
        trigger={['click']}>
        <Button shape='circle' type="text" size='small' onClick={handleNoneAction}>
          <MoreOutlined />
        </Button>
      </Dropdown>
      {
        newPackage &&
        <PackageDialog
          pkg={newPackage}
          open={!!newPackage}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      }

    </>
  )
})