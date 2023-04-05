import { Collapse } from 'antd';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import MultLangForm from './MultLangForm';
const { Panel } = Collapse;

const AppConfig = memo(() => {
  const { t } = useTranslation();

  return (
    <div
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div
        style={{
          width: 800,
          marginTop: 16,
        }}
      >
        <Collapse defaultActiveKey={['muti-lang']}>
          <Panel header={t("MultiLang.Title")} key="muti-lang">
            <MultLangForm />
          </Panel>
          <Panel header={t("Config.Other")} key="other">
            <p>Other config</p>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
});

export default AppConfig;