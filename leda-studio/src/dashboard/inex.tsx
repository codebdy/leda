import { memo, useCallback } from "react"
import styled from "styled-components"
import { Logo } from "./Logo"
import { Badge, Button, Divider, Space } from "antd"
import { AppstoreOutlined, CloudServerOutlined, SettingOutlined, BellOutlined } from "@ant-design/icons"
import { Spring } from "./Spring"
import { useTranslation } from "react-i18next"
import { StyledThemeRoot } from "./StyledThemeRoot"
import { ConfigRoot } from "./ConfigRoot"
import { useRecoilState } from "recoil"
import { themeModeState } from "recoil/atoms"
import AvatarMenu from "components/AvatarMenu"
import LangSelect from "components/LangSelect"
import { Outlet, useMatch, useNavigate } from "react-router-dom"
import { DashboardRoutes } from "./Routes"

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column;
  background-color:${props => props.theme.token?.colorBgBase};
`

const Toolbar = styled.div`
  display: flex;
  height: 56px;
  align-items: center;
  padding: 0 64px;
  border-bottom: ${props => props.theme.token?.colorBorder} solid 1px;
  flex-shrink:0;
`
const StyledDivider = styled(Divider)`
  height: 16px;
  margin: 0 24px;
`

const Content = styled.div`
  flex: 1;
  padding: 0 112px;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
  flex:1;
  overflow: auto;
`


export const Dashbord = memo(() => {
  const { t } = useTranslation();
  const [themeMode, setThemeMode] = useRecoilState(themeModeState)
  const navigate = useNavigate();

  const match = useMatch(`/*`)

  const handleToggleTheme = useCallback(() => {
    setThemeMode(mode => mode === 'light' ? 'dark' : 'light')
  }, [setThemeMode])

  const handleToAppManager = useCallback(() => {
    navigate(`/${DashboardRoutes.AppManager}`)
  }, [navigate])

  const handleToServices = useCallback(() => {
    navigate(`/${DashboardRoutes.Services}`)
  }, [navigate])

  return (
    <ConfigRoot>
      <StyledThemeRoot>
        <Container>
          <Toolbar>
            <Logo />
            <StyledDivider type="vertical" />
            <Space>
              <Button
                type={match?.pathname === `/${DashboardRoutes.AppManager}` || match?.pathname === "/" ? "primary" : "text"}
                icon={<AppstoreOutlined />}
                onClick={handleToAppManager}
              >
                {t("Apps")}
              </Button>
              <Button
                type={match?.pathname === `/${DashboardRoutes.Services}` ? "primary" : "text"}
                icon={<CloudServerOutlined />}
                onClick={handleToServices}
              >
                {t("Services")}
              </Button>
              <Button type="text" icon={<SettingOutlined />}>
                {t("Configs.Title")}
              </Button>
            </Space>
            <Spring />
            <Space>
              <Button type="text" icon={
                themeMode === 'light' ?
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><rect fill="none" height="24" width="24" /><path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" /></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495l1.408 1.407-1.79 1.79-1.407-1.408zm-1.8 15.115l1.79 1.8 1.41-1.41-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 4h2v2.95h-2zm-7.45-.96l1.41 1.41 1.79-1.8-1.41-1.41z" /></svg>
              }
                onClick={handleToggleTheme}
              />
              <Badge count={5} offset={[-6, 2]}>
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
              <AvatarMenu />
              <LangSelect />
            </Space>
          </Toolbar>
          <Content>
            <Outlet />
          </Content>
        </Container>
      </StyledThemeRoot>
    </ConfigRoot>
  )
})