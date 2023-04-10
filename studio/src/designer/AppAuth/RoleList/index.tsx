import { Menu, MenuProps } from "antd";
import React, { useCallback, useMemo } from "react"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { GUEST_ROLE_ID } from "consts";
import { useParseLangMessage } from "plugin-sdk";
import { ID } from "shared";
import { useRoles } from "../hooks/useRoles";
import "./style.less";

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



export const RoleList = memo((
  props: {
    selectedRoleId?: ID,
    onSelect?: (selectedRoleId?: ID) => void,
  }
) => {
  const { selectedRoleId, onSelect } = props;
  const roles = useRoles();
  const p = useParseLangMessage();
  const { t } = useTranslation();
  const handleSelect = useCallback((info: any) => {
    onSelect && onSelect(info.key)
  }, [onSelect])

  const items: MenuProps['items'] = useMemo(
    () => [
      ...roles.map(
        role => getItem(
          p(role.name),
          role.id,
          <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z" />
          </svg>
        )
      ),
      getItem(
        t("Auth.Guest"),
        GUEST_ROLE_ID,
        <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
          <path fill="currentColor" d="M20.5,14.5V16H19V14.5H20.5M18.5,9.5H17V9A3,3 0 0,1 20,6A3,3 0 0,1 23,9C23,9.97 22.5,10.88 21.71,11.41L21.41,11.6C20.84,12 20.5,12.61 20.5,13.3V13.5H19V13.3C19,12.11 19.6,11 20.59,10.35L20.88,10.16C21.27,9.9 21.5,9.47 21.5,9A1.5,1.5 0 0,0 20,7.5A1.5,1.5 0 0,0 18.5,9V9.5M9,13C11.67,13 17,14.34 17,17V20H1V17C1,14.34 6.33,13 9,13M9,4A4,4 0 0,1 13,8A4,4 0 0,1 9,12A4,4 0 0,1 5,8A4,4 0 0,1 9,4M9,14.9C6.03,14.9 2.9,16.36 2.9,17V18.1H15.1V17C15.1,16.36 11.97,14.9 9,14.9M9,5.9A2.1,2.1 0 0,0 6.9,8A2.1,2.1 0 0,0 9,10.1A2.1,2.1 0 0,0 11.1,8A2.1,2.1 0 0,0 9,5.9Z" />
        </svg>
      )
    ],
    [p, roles, t]);

  return (
    <div className="right-border role-list">
      <div className="bottom-border roles-title">
        {t("Auth.Role List")}
      </div>
      <div className="role-list-body">
        <Menu
          mode="inline"
          items={items}
          activeKey={selectedRoleId}
          onSelect={handleSelect}
        />
      </div>

    </div>
  )
})