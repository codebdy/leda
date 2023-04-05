import { Form, message, Modal } from "antd"
import ImageUploader from "components/ImageUploader";
import { MultiLangInput } from "components/MultiLangInput";
import { useShowError } from "designer/hooks/useShowError";
import { useUpsertApp } from "designer/hooks/useUpsertApp";
import { IApp, IAppInput } from "model";
import React, { useCallback, useEffect } from "react";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { createUuid } from "shared";

export const UpsertAppModel = memo((
  props: {
    app?: IApp,
    visible?: boolean,
    onClose?: () => void,
  }
) => {
  const { app, visible, onClose } = props;
  const [form] = Form.useForm<IAppInput>();
  const { t } = useTranslation();

  const reset = useCallback(() => {
    form.setFieldsValue({ title: app?.title || "", imageUrl: app?.imageUrl || "" })
  }, [app?.imageUrl, app?.title, form])

  useEffect(() => {
    reset();
  }, [form, reset])

  const [upsert, { loading, error }] = useUpsertApp({
    onCompleted: () => {
      message.success(t("OperateSuccess"))
      onClose?.();
    }
  });

  useShowError(error);

  const handleOk = useCallback(() => {
    form.validateFields().then((formData) => {
      const { title, imageUrl } = formData;
      upsert({ title, imageUrl, uuid: app?.uuid || createUuid(), id: app?.id })
      !app && reset();
    }).catch((err) => {
      console.error("form validate error", err);
    });
  }, [app, upsert, form, reset]);

  return (
    <Modal
      title={app ? t("AppManager.UpdateApp") : t("AppManager.CreateApp")}
      okText={t("Confirm")}
      cancelText={t("Cancel")}
      forceRender
      okButtonProps={{
        loading: loading
      }}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form
        name="createApp"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ title: "", description: "" }}
        form={form}
        autoComplete="off"
      >
        <Form.Item
          label={t("AppName")}
          name="title"
          rules={[{ required: true, message: t("Required") }]}
        >
          <MultiLangInput inline title={t("AppName")} />
        </Form.Item>

        < Form.Item
          label={t("Image")}
          name="imageUrl"
        >
          <ImageUploader title={t("Upload")} maxCount={1} />
        </Form.Item>
      </Form>
    </Modal>
  )
})