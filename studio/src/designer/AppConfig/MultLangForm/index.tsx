import { Form, message, Switch } from 'antd';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useShowError } from 'designer/hooks/useShowError';
import { useUpsertAppConfig } from 'designer/hooks/useUpsertAppConfig';
import { useDesignerAppConfig } from 'plugin-sdk/contexts/desinger';
import LangResourceEditor from './LangResourceEditor';
import LangSelect from './LangSelect';
import "./style.less"

const MultLangForm = memo(() => {
  const { t } = useTranslation();
  const appConfig = useDesignerAppConfig();
  const [upsert, { loading, error }] = useUpsertAppConfig(
    {
      onCompleted: () => {
        message.success(t("OperateSuccess"));
      }
    }
  );

  useShowError(error);

  const handleOpenChange = useCallback((checked: boolean) => {
    upsert({
      ...appConfig,
      app: {
        sync: {
          id: appConfig?.app?.id,
        }
      },
      schemaJson: {
        ...appConfig?.schemaJson,
        multiLang: { ...appConfig?.schemaJson?.multiLang, open: checked }
      }
    })
  }, [appConfig, upsert]);

  return (
    <Form
      name="multlang"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
    >
      <Form.Item
        label={t("MultiLang.Open")}
        name="open"
      >
        <Switch
          checked={appConfig?.schemaJson?.multiLang?.open}
          loading={loading}
          onChange={handleOpenChange}
        />
      </Form.Item>
      {
        appConfig?.schemaJson?.multiLang?.open &&
        <>
          <Form.Item
            label={t("MultiLang.Langs")}
            name="langs"
          >
            <LangSelect />
          </Form.Item>
          <Form.Item
            label={t("MultiLang.Resources")}
            name="langs"
          >
            <LangResourceEditor />
          </Form.Item>
        </>
      }
    </Form>
  );
});

export default MultLangForm;