import { Space, Button, message } from "antd";
import React, { useCallback } from "react";
import { memo } from "react";
import { useRecoilState } from "recoil";
import PublishButton from "./PublishButton";
import { changedState } from "../recoil/atoms";
import { useValidate } from "../hooks/useValidate";
import { useShowError } from "designer/hooks/useShowError";
import { useGetMeta } from "../hooks/useGetMeta";
import { useTranslation } from "react-i18next";
import { SaveOutlined } from "@ant-design/icons";
import { ID } from "shared";
import { IApp } from "model";
import { useUpsertApp } from "designer/hooks/useUpsertApp";

const SaveActions = memo((props: {
  appId: ID
}) => {
  const { appId } = props;
  const [changed, setChanged] = useRecoilState(changedState(appId));
  const getMeta = useGetMeta(appId);
  const { t } = useTranslation();
  const [save, { loading, error }] = useUpsertApp({
    onCompleted(data: IApp) {
      message.success(t("OperateSuccess"));
      setChanged(false);
    }
  })

  const validate = useValidate(appId);

  useShowError(error);

  const handleSave = useCallback(() => {
    if (!validate()) {
      return;
    }
    const data = getMeta()
    save({ id: appId, meta: data, saveMetaAt: new Date() });
  }, [save, appId, getMeta, validate]);

  return (
    <Space>
      <Button
        type="primary"
        disabled={!changed}
        icon={<SaveOutlined />}
        loading={loading}
        onClick={handleSave}
      >
        {t("Save")}
      </Button>
      <PublishButton />
    </Space>
  )
})

export default SaveActions;