import { LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Dropdown, MenuProps, Modal } from "antd"
import React, { memo, useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMe } from "plugin-sdk/contexts/login";
import { LOGIN_URL, DESIGNER_TOKEN_NAME } from "consts";
import { useLogout, useSetToken } from "enthooks";
import ChangePasswordForm from "./ChangePasswordForm";
import styled from "styled-components";

export interface IComponentProps {
  trigger?: ("click" | "hover" | "contextMenu")[]
}

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
`

const AvatarMenu = memo((props: IComponentProps) => {
  const { trigger, ...other } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const setToken = useSetToken();
  const me = useMe()
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [logout] = useLogout()

  const handleLogout = useCallback(() => {
    setToken(undefined);
    localStorage.removeItem(DESIGNER_TOKEN_NAME);
    navigate(LOGIN_URL)
    logout();
  }, [logout, navigate, setToken])

  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);


  const items: MenuProps['items'] = useMemo(() => (
    [
      {
        key: 'changepPassword',
        icon: <LockOutlined />,
        label: t("ChangePassword"),
        onClick: showModal,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: t("Logout"),
        onClick: handleLogout,
      },
    ]
  ), [handleLogout, showModal, t]);

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomRight" arrow trigger={trigger || ['click']} >
        <StyledAvatar icon={!me && <UserOutlined />} {...other}>
          {me?.name?.substring(0, 1)?.toUpperCase()}
        </StyledAvatar>
      </Dropdown>
      <Modal
        title={t("ChangePassword")}
        open={isModalVisible}
        footer={null}
        width={460}
        onCancel={handleCancel}
      >
        {me?.loginName && <ChangePasswordForm onClose={handleCancel} loginName={me.loginName} />}
      </Modal>
    </>
  )
})

export default AvatarMenu
