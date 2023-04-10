import { Card, Spin } from 'antd';
import { gql } from '../enthooks';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from '../enthooks/hooks/useRequest';
import { useShowError } from 'designer/hooks/useShowError';
import Installed from './Installed';
import InstallForm from './InstallForm';

const queryGql = gql`
  query{
    installed
  }
`;

const Install = memo(() => {
  const { data, error, loading } = useRequest(queryGql);
  const { t } = useTranslation();
  useShowError(error)

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      background: "url(/img/background1.jpg)",
      height: "100vh",
      backgroundPosition: " 50%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}>
      <Card
        title={t("Install.Title")}
      >
        <div style={{
          minHeight: 160,
          width: 400,
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {
            loading ?
              <Spin size="large" />
              : (
                data?.installed ?
                  <Installed />
                  :
                  (!error && <InstallForm />)
              )
          }
          {
            error && <div style={{ color: "red" }}>{error.message}</div>
          }

        </div>
      </Card>
    </div>
  );
});

export default Install;