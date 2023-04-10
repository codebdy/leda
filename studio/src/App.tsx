import { memo } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './Login';
import AppDesigner from './designer/index';
import Install from './Install';
import { DESIGN, DESIGNER_TOKEN_NAME, DESIGN_BOARD, INDEX_URL, INSTALL_URL, LOGIN_URL, SERVER_URL, SYSTEM_APP_ID } from './consts';
import { AppEntryRouts } from './designer/DesignerHeader/AppEntryRouts';
import AppUis from './designer/DesignerHeader/AppUis';
import { LoggedInPanel } from './Login/LoggedInPanel';
import { AppFrames } from './designer/DesignerHeader/AppFrames';
import { AppBpmn } from './designer/AppBpmn';
import { AppDmn } from './designer/AppDmn';
import AppConfig from './designer/AppConfig';
import AppUml from './designer/AppUml';
import ApiBoard from './designer/ApiBoard';
import { AuthBoard, AuthRoutes } from './designer/AppAuth';
import { MenuAuthBoard } from './designer/AppAuth/MenuAuthBoard';
import { ModelAuthBoard } from './designer/AppAuth/ModelAuthBoard';
import { PageAuthBoard } from './designer/AppAuth/PageAuthBoard';
import { EntiRoot } from './enthooks';
import { AppDesignBoard } from './designer/AppDesignBoard/inex';
import { Dashbord } from 'dashboard/inex';
import { DashboardRoutes } from 'dashboard/Routes';
import { AppManager } from 'dashboard/AppManager';
import { Services } from 'dashboard/Services';

const App = memo(() => {
  return (
    <EntiRoot config={{ endpoint: SERVER_URL, appId: SYSTEM_APP_ID, tokenName: DESIGNER_TOKEN_NAME }} >
      <Routes>
        <Route path={INDEX_URL} element={<LoggedInPanel />}>
          <Route path={INDEX_URL} element={<Dashbord />}>
            <Route path={""} element={<AppManager />} />
            <Route path={DashboardRoutes.AppManager} element={<AppManager />} />
            <Route path={DashboardRoutes.Services} element={<Services />} />
          </Route>
          <Route path={`/${DESIGN}`} element={<AppDesigner />}>
            <Route path=":appId">
              <Route path={DESIGN_BOARD} element={<AppDesignBoard />}>
                <Route path={AppEntryRouts.AppUis} element={<AppUis />} />
                <Route path={AppEntryRouts.Bpmn} element={<AppBpmn />} />
                <Route path={AppEntryRouts.Dmn} element={<AppDmn />} />
                <Route path={AppEntryRouts.Uml} element={<AppUml />} />
                <Route path={AppEntryRouts.Api} element={<ApiBoard />} />
                <Route path={AppEntryRouts.Frame} element={<AppFrames />} />
                <Route path={AppEntryRouts.Auth} element={<AuthBoard />}>
                  <Route path={AuthRoutes.MenuAuth} element={<MenuAuthBoard />} />
                  <Route path={AuthRoutes.ComponentAuth} element={<PageAuthBoard />} />
                  <Route path={AuthRoutes.ModelAuth} element={<ModelAuthBoard />} />
                  <Route path="" element={<MenuAuthBoard />} />
                </Route>
                <Route path={AppEntryRouts.Config} element={<AppConfig />}></Route>
                <Route path="" element={<AppUis />}></Route>
              </Route>
            </Route>
            <Route path="" element={<AppDesignBoard />} >
              <Route path="" element={<AppUis />}></Route>
            </Route>
          </Route>
        </Route>
        <Route path={LOGIN_URL} element={<Login />} />
        <Route path={INSTALL_URL} element={<Install />} />
      </Routes>
    </EntiRoot>
  )
});

export default App