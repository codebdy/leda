import { Button, Checkbox, Form, Input, Space } from 'antd';
import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL } from '../consts';
import { useInstall } from '../enthooks/hooks/useInstall';
import { useShowError } from 'designer/hooks/useShowError';
//import * as meta from './data.json';

const InstallForm = memo(() => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { t } = useTranslation();
  
  const [install, { loading, error }] = useInstall({
    onCompleted: (data) => {
      if (data?.install) {
        next()
      }
    }
  })

  useShowError(error)

  const next = useCallback(() => {
    setCurrent(current => current + 1);
  }, []);

  const prev = useCallback(() => {
    setCurrent(current => current - 1);
  }, []);

  const handleInstall = useCallback(() => {
    form.validateFields().then((values) => {
      install({
        //meta,
        ...values
      })
    })

  }, [form, install])

  const handleFinished = useCallback(() => {
    navigate(LOGIN_URL);
  }, [navigate])

  return (
    <>
      <div style={{
        minHeight: 160,
        width: 400
      }}>
        {
          current === 0 &&
          <>
            <p></p>
            <p>{t("Install.Start1")}</p>
            <p>{t("Install.Start2")}</p>
          </>
        }
        {
          current === 1 &&
          <Form
            name="install"
            form={form}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            initialValues={{ admin: "admin", password: "123456", withDemo: true }}
            autoComplete="off"
          >
            <Form.Item
              label={t("Install.Account")}
              name="admin"
              rules={[{ required: true, message: t("Required") }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t("Install.Password")}
              name="password"
              rules={[{ required: true, message: t("Required") }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name="withDemo" valuePropName="checked" wrapperCol={{ offset: 7, span: 16 }}>
              <Checkbox>{t("Install.WithDemo")}</Checkbox>
            </Form.Item>
          </Form>
        }
        {
          current === 2 &&
          <>
            <p>{t("Install.Success1")}</p>
            <p>{t("Install.Success2")}</p>
          </>
        }
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Space>
          {
            current === 1 &&
            <Button onClick={prev}>
              {t("Install.Previous")}
            </Button>
          }

          {
            current === 0 &&
            <Button type="primary" onClick={next}>
              {t("Install.Next")}
            </Button>
          }

          {
            current === 1 &&
            <Button type="primary" onClick={handleInstall} loading={loading}>
              {t("Install.Install")}
            </Button>
          }
          {
            current === 2 &&
            <Button type="primary" onClick={handleFinished}>
              {t("Install.Finished")}
            </Button>
          }
        </Space>
      </div>
    </>
  );
});

export default InstallForm;