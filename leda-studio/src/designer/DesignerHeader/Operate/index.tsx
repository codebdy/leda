import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';
import React, { memo, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImportApp } from 'enthooks/hooks/useImportApp';
import { useEdittingAppId } from 'designer/hooks/useEdittingAppUuid';
import { useShowError } from 'designer/hooks/useShowError';
import { ExportDialog } from './ExportDialog';
import { MakeVersionDialog } from './MakeVersionDialog';
import { useUpsertApp } from 'designer/hooks/useUpsertApp';

enum OperateEnum {
  createVaresion = "createVaresion",
  export = "export",
  import = "import",
  publish = "publish"
}

export const Operate = memo(() => {
  const appId = useEdittingAppId();
  const [makeVersionOpen, setMakeVersionOpen] = useState<boolean>();
  const [exportOpen, setExportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const [importApp, { error, loading }] = useImportApp(
    {
      onCompleted: (data) => {
        if (data?.importApp) {
          message.success(t("Designer.ImportSuccess"))
        } else {
          message.error(t("Designer.ImportFailed"))
        }
      }
    }
  );

  const [upsert, { loading: publishing, error: publishError }] = useUpsertApp(
    {
      onCompleted: () => {
        message.success(t("Designer.PublishSuccess"))
      }
    }
  );

  useShowError(error || publishError);

  const handleMenuClick = useCallback(({ key }: any) => {

    if (key === OperateEnum.createVaresion) {
      setMakeVersionOpen(true)
    } else if (key === OperateEnum.export) {
      setExportOpen(true)
    } else if (key === OperateEnum.import) {
      fileInputRef.current?.click()
    } else if (key === OperateEnum.publish) {
      upsert({ id: appId, published: true })
    }
  }, [fileInputRef, appId, upsert])


  const handleMakeVersionOpenChange = useCallback((open?: boolean) => {
    setMakeVersionOpen(open);
  }, [])

  const handleAppFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const zipFile = event.target.files
        ? event.target.files[0]
        : undefined;
      if (zipFile) {
        importApp(zipFile, appId)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    },
    [importApp, appId]
  );

  return (
    <>
      <Dropdown menu={{
        onClick: handleMenuClick,
        items: [
          {
            key: OperateEnum.createVaresion,
            label: t("Designer.CreateVersion"),
          },
          {
            key: OperateEnum.export,
            label: t("Designer.Export"),
          },
          {
            key: OperateEnum.import,
            label: t("Designer.Import"),
          },
          {
            key: OperateEnum.publish,
            label: t("Designer.Publish"),
          },
        ]
      }}>
        <Button type="text" onClick={e => e.preventDefault()} loading={loading || publishing}>
          <Space>
            {t("Designer.Operate")}
            <DownOutlined style={{ fontSize: 12 }} />
          </Space>
        </Button>
      </Dropdown>
      <MakeVersionDialog open={makeVersionOpen} onOpenChange={handleMakeVersionOpenChange} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen as any} />
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        style={{ display: "none" }}
        multiple={false}
        onChange={handleAppFileInputChange}
      />
    </>
  )
});
