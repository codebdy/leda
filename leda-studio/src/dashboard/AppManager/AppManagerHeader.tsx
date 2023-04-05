import { Button, Input, Space } from "antd";
import { Spring } from "../Spring";
import { memo, useCallback } from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next";
import { useImportApp } from "enthooks/hooks/useImportApp";
import { useAppOpenFile } from "./hooks/useAppOpenFile";
import { useShowError } from "designer/hooks/useShowError";
import { CreateAppDialog } from "./AppModal/CreateAppDialog";

const Container = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
`
const { Search } = Input;

export const AppManagerHeader = memo(() => {
  const { t } = useTranslation();
  const [importApp, { loading, error }] = useImportApp();
  const openFile = useAppOpenFile();

  useShowError(error);

  const handleImport = useCallback(() => {
    openFile().then((file: File) => {
      importApp(file)
    })
  }, [importApp, openFile])

  return (
    <Container>
      <Search placeholder="" style={{ width: 300 }} />
      <Spring />
      <Space>
        <Button onClick={handleImport} loading={loading}>
          {t('AppManager.ImportApp')}
        </Button>
        <CreateAppDialog />
      </Space>
    </Container>
  )
})