import { useTranslation } from "react-i18next";
import { ColumnsType } from 'antd/es/table';
import { useMemo } from "react";
import { ID } from "shared";
import { IUiAuthRow } from "../IUiAuthConfig";
import { MenuAuthChecker } from "./MenuAuthChecker";

export function useColumns(roleId: ID) {
  const { t } = useTranslation();
  const columns: ColumnsType<IUiAuthRow> = useMemo(() => [
    {
      title: t("Auth.MenuItem"),
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: t('Auth.Permit'),
      dataIndex: 'permit',
      key: 'permit',
      width: '12%',
      render: (_, { menuItemUuid, menuConfig, device }) => {
        return <MenuAuthChecker
          roleId={roleId}
          menuAuthConfig={menuConfig}
          menuItemUuid={menuItemUuid || ""}
          device={device}
        />
      }
    },
    {
      title: "",
      dataIndex: 'blank',
      key: 'blank',
    },

  ], [roleId, t]);

  return columns;
}