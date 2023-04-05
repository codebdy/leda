import React, { useCallback, useMemo } from "react"
import { memo } from "react"
import { Outlet, useMatch, useNavigate } from "react-router-dom"
import { ListConentLayout } from "common/ListConentLayout"
import { MenuProps, Spin } from 'antd';
import { Menu } from 'antd';
import { LayoutOutlined, MenuOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./style.less";
import SvgIcon from "common/SvgIcon";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useReadMeta } from "../AppUml/hooks/useReadMeta";
import { useShowError } from "designer/hooks/useShowError";
import { useQueryRoles } from "./hooks/useQueryRoles";
import { DESIGN, DESIGN_BOARD } from "consts";
import { AppEntryRouts } from "../DesignerHeader/AppEntryRouts";


export enum AuthRoutes {
  MenuAuth = "menu-auth",
  ComponentAuth = "component-auth",
  ModelAuth = "model-auth",
  AppAuth = "app-auth"
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const AuthBoard = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const appId = useEdittingAppId();
  const { loading, error } = useReadMeta(appId);
  const { loading: rolesLoading, error: rolesError } = useQueryRoles();
  const matchString = useMemo(() => {
    return `/${DESIGN}/${appId}/${DESIGN_BOARD}/${AppEntryRouts.Auth}/*`
  }, [appId])

  const match = useMatch(matchString)
  useShowError(error || rolesError);

  const items: MenuProps['items'] = useMemo(() => [
    getItem(t("Auth.MenuAuth"), AuthRoutes.MenuAuth, <MenuOutlined />, undefined),
    getItem(t("Auth.ComponentAuth"), AuthRoutes.ComponentAuth, <LayoutOutlined />, undefined),
    getItem(t("Auth.ModelAuth"),
      AuthRoutes.ModelAuth,
      <SvgIcon>
        <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 968 968" version="1.1">
          <path d="M513.89 950.72c-5.5 0-11-1.4-15.99-4.2L143.84 743c-9.85-5.73-15.99-16.17-15.99-27.64V308.58c0-11.33 6.14-21.91 15.99-27.64L497.9 77.43c9.85-5.73 22.14-5.73 31.99 0l354.06 203.52c9.85 5.73 15.99 16.17 15.99 27.64V715.5c0 11.33-6.14 21.91-15.99 27.64L529.89 946.52c-4.99 2.8-10.49 4.2-16 4.2zM191.83 697.15L513.89 882.2l322.07-185.05V326.92L513.89 141.87 191.83 326.92v370.23z m322.06-153.34c-5.37 0-10.88-1.4-15.99-4.33L244.29 393.91c-15.35-8.79-20.6-28.27-11.77-43.56 8.83-15.28 28.41-20.5 43.76-11.72l253.61 145.7c15.35 8.79 20.6 28.27 11.77 43.56-6.01 10.32-16.76 15.92-27.77 15.92z m0 291.52c-17.66 0-31.99-14.26-31.99-31.84V530.44L244.55 393.91s-0.13 0-0.13-0.13l-100.45-57.69c-15.35-8.79-20.6-28.27-11.77-43.56s28.41-20.5 43.76-11.72l354.06 203.52c9.85 5.73 15.99 16.17 15.99 27.64v291.39c-0.13 17.71-14.46 31.97-32.12 31.97z m0 115.39c-17.66 0-31.99-14.26-31.99-31.84V511.97c0-17.58 14.33-31.84 31.99-31.84s31.99 14.26 31.99 31.84v406.91c0 17.7-14.33 31.84-31.99 31.84z m0-406.91c-11 0-21.75-5.73-27.77-15.92-8.83-15.28-3.58-34.64 11.77-43.56l354.06-203.52c15.35-8.79 34.8-3.57 43.76 11.72 8.83 15.28 3.58 34.64-11.77 43.56L529.89 539.61c-4.99 2.93-10.49 4.2-16 4.2z"></path>
        </svg>
      </SvgIcon>,
      undefined,
    ),
  ], [t]);

  const onClick: MenuProps['onClick'] = useCallback((e: any) => {
    navigate(e.key)
  }, [navigate]);

  const activeKey = useMemo(() => {
    return match?.params?.["*"] || AuthRoutes.MenuAuth
  }, [match])

  return (
    <Spin tip="Loading..." spinning={loading || rolesLoading}>
      <ListConentLayout
        className="appx-auth-board"
        listWidth={200}
        list={
          <Menu
            style={{ flex: 1 }}
            onClick={onClick}
            activeKey={activeKey}
            mode="inline"
            items={items}
          />
        }
      >
        <Outlet />
      </ListConentLayout>
    </Spin>
  )
})