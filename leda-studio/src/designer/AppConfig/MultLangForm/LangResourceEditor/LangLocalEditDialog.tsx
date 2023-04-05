import { Form, Input, Modal } from "antd";
import { ILangLocalInput } from "model";
import React, { useCallback, useEffect, useState } from "react";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { useDesignerAppConfig, useDesignerParams } from "plugin-sdk/contexts/desinger";
import { useUpsertLangLocal } from "designer/hooks/useUpsertLangLocal";
import { useShowError } from "designer/hooks/useShowError";

const LangLocalEditDialog = memo((
  props: {
    langLocal?: ILangLocalInput,
    onClose: () => void,
  }
) => {
  const { langLocal, onClose } = props;
  const [nameError, setNameError] = useState<string>();
  const { t } = useTranslation()
  const appConfig = useDesignerAppConfig();
  const [form] = Form.useForm();
  const { langLocales } = useDesignerParams();

  const resetForm = useCallback(() => {
    setNameError("");
    form.resetFields();
    form.setFieldsValue({
      name: langLocal?.name,
      ...langLocal?.schemaJson
    })
  }, [form, langLocal?.name, langLocal?.schemaJson])

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const [upsert, { loading, error }] = useUpsertLangLocal(
    {
      onCompleted: () => {
        onClose();
        resetForm();
      }
    }
  );

  useShowError(error);

  const handleOk = () => {
    form.validateFields().then((formValues) => {
      if (langLocales?.find(lang => lang.name === formValues.name && langLocal?.id !== lang.id)) {
        setNameError(t("ErrorNameRepeat"))
        return;
      }
      const { name, ...schemaJson } = formValues
      upsert({
        id: langLocal?.id,
        name: formValues.name,
        schemaJson: schemaJson
      })
    })

  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      title={langLocal?.id ? t("MultiLang.LangResourcesEdit") : t("MultiLang.NewLangResource")}
      visible={!!langLocal}
      okText={t("Confirm")}
      width={600}
      cancelText={t("Cancel")}
      okButtonProps={{
        loading: loading
      }}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div style={{ height: "calc(100vh - 300px)", overflow: "auto" }}>
        <Form
          name="edit-lang-local"
          form={form}
          labelCol={{ span: 6 }}
          labelWrap
          wrapperCol={{ span: 17 }}
          autoComplete="off"
        >
          <Form.Item
            label={t("Name")}
            name="name"
            rules={[{ required: true, message: t("Required") }]}
            help={nameError}
            validateStatus={nameError ? "error" : undefined}
          >
            <Input onChange={() => { setNameError(""); }} />
          </Form.Item>
          {
            appConfig?.schemaJson?.multiLang?.langs?.map((lang) => {
              return (
                <Form.Item
                  label={t("Lang." + lang.key)}
                  name={lang.key}
                >
                  <Input.TextArea />
                </Form.Item>
              )
            })
          }

        </Form>
      </div>
    </Modal>
  )
})

export default LangLocalEditDialog;