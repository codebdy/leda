import { memo, useCallback, useMemo, useState } from "react"
import { useChangePassword } from "enthooks/hooks/useChangePassword";
import { useShowError } from "designer/hooks/useShowError";
import { Button, Form, Input, message } from "antd";
import { useSetToken } from "enthooks";
import { DESIGNER_TOKEN_NAME } from "consts";
import { useTranslation } from "react-i18next";

const ChangePasswordForm = memo((
  props: {
    onClose: () => void,
    loginName: string,
  }
) => {
  const { loginName, onClose } = props;
  const [isError, setIsError] = useState(false);
  const setToken = useSetToken();
  const { t } = useTranslation();
  const [change, { error, loading }] = useChangePassword({
    onCompleted: (token?: string) => {
      if (token) {
        message.success(t("OperateSuccess"))
        setToken(token);
        if (localStorage.getItem(DESIGNER_TOKEN_NAME)) {
          localStorage.setItem(DESIGNER_TOKEN_NAME, token)
        }
        onClose()
      }
    }
  });

  useShowError(error)

  const [form] = Form.useForm()

  const handleSubmit = useCallback((values: { oldPassword: string, newPassword: string }) => {
    const { oldPassword, newPassword } = values;
    change({
      loginName,
      oldPassword,
      newPassword
    })
  }, [change, loginName])
  const confirmMessage = useMemo(() => t("PasswordDisaccord"), [t]);

  const handleChange = useCallback((values: any) => {
    if (values?.['oldPassword']) {
      return;
    }
    const value = form.getFieldsValue()
    if (value?.['confirmPassword'] !== value?.['newPassword'] && value?.['confirmPassword']) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [form])
  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      onValuesChange={handleChange}
      onFinish={handleSubmit}
    >
      <Form.Item
        label={t("OldPassword")}
        name={"oldPassword"}
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label={t("NewPassword")}
        name="newPassword"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label={t("ConfirmPassword")}
        name="confirmPassword"
        rules={[{ required: true, message: 'Please input your password!' }]}
        help={isError ? confirmMessage : undefined}
        validateStatus={isError ? "error" : undefined}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {t("ConfirmChange")}
        </Button>
      </Form.Item>
    </Form>
  )
})

export default ChangePasswordForm