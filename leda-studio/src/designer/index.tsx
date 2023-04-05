import { memo } from "react"
import { Outlet } from "react-router-dom";
import { useQueryApp } from "./hooks/useQueryApp";
import { useShowError } from 'designer/hooks/useShowError';
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import AppDesignerRoot from "./AppDesignerRoot";

const AppDesigner = memo(() => {
  const appId = useEdittingAppId();
  const { app, error } = useQueryApp(appId)

  useShowError(error);

  return (
    app ?
      <AppDesignerRoot app={app}>
        <Outlet />
      </AppDesignerRoot>
      : <></>
  )
})

export default AppDesigner;