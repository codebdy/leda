
import { Layout } from 'antd';
import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { useDesignerParams } from 'plugin-sdk';
import DesignerHeader from "../DesignerHeader";

const { Content } = Layout;
export const AppDesignBoard = memo(() => {
  const { app } = useDesignerParams();
  return (
    <Layout>
      <DesignerHeader app={app} />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  )
})