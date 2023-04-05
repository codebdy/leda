import { useCallback, useEffect } from "react";
import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { MultiLangInput } from "components/MultiLangInput";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { CodeMeta } from "../meta";
import { useBackupSnapshot } from "../hooks/useBackupSnapshot";
import { codesState } from "../recoil/atoms";
import { useSetRecoilState } from "recoil";

export const CodePanel = (props: { code: CodeMeta }) => {
  const { code } = props;
  const appId = useEdittingAppId();
  const backup = useBackupSnapshot(appId);
  const setCodes = useSetRecoilState(codesState(appId));
  const { t } = useTranslation();
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields();
  }, [form, code.uuid])

  useEffect(
    () => {
      form.setFieldsValue({ ...code });
    },
    [code, form]
  )
  const handleChange = useCallback((formData: any) => {
    backup();
    setCodes(codes => codes.map(dm => dm.uuid === code.uuid ? { ...code, ...formData } : dm))
  }, [backup, code, setCodes])

  return (
    <div className="property-pannel">
      <Form
        name="classForm"
        form={form}
        colon={false}
        labelAlign="left"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        initialValues={code}
        autoComplete="off"
        onValuesChange={handleChange}
      >
        <Form.Item
          label={t("AppUml.Name")}
          name="name"
        >
          <MultiLangInput inline title={t("Label")} />
        </Form.Item>
        <Form.Item
          label={t("AppUml.Description")}
          name="description"
        >
          <Input.TextArea />
        </Form.Item>

      </Form>
    </div>
  );
};
