import { Form, message, Modal } from "antd";
import React, { memo, useCallback } from "react"
import { useTranslation } from "react-i18next";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useShowError } from "designer/hooks/useShowError";
import { MultiLangInput } from "components/MultiLangInput";
import { MakeVersionInput, useCreateVersion } from "enthooks/hooks/useCreateVersion";

export const MakeVersionDialog = memo((
  props: {
    open?: boolean,
    onOpenChange?: (open?: boolean) => void
  }
) => {
  const { open, onOpenChange } = props;
  const appId = useEdittingAppId();
  const { t } = useTranslation();
  const [form] = Form.useForm<any>();
  const [create, { loading, error }] = useCreateVersion({
    onCompleted: () => {
      onOpenChange && onOpenChange(false);
      message.success(t("OperateSuccess"));
      form.resetFields();
    }
  });

  useShowError(error)

  const handleOk = useCallback(() => {
    form.validateFields().then((values: MakeVersionInput) => {
      create({
        appId,
        instanceId: appId,
        version: values?.version,
        description: values?.description
      })
    })

  }, [form, create, appId])

  const handleCancel = useCallback(() => {
    onOpenChange && onOpenChange(false);
    form.resetFields()
  }, [onOpenChange, form])
  return (
    <Modal
      title={t("Designer.CreateVersion")}
      cancelText={t("Cancel")}
      okText={t("Confirm")}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        loading: loading
      }}
    >
      <Form
        name="makeVersion"
        labelWrap
        initialValues={{ title: "", description: "" }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        form={form}
        autoComplete="off"
      >
        <Form.Item
          label={t("Designer.VersionNumber")}
          name="version"
          rules={[{ required: true, message: t("Required") }]}
        >
          <MultiLangInput inline title={t("Designer.VersionNumber")} />
        </Form.Item>
        <Form.Item
          label={t("Description")}
          name="description"
        >
          <MultiLangInput inline multiline title={t("Description")} />
        </Form.Item>
      </Form>
    </Modal>
  )
})