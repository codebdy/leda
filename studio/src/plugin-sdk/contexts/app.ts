import { JSXComponent } from "@formily/core";
import { Device } from "@rxdrag/appx-plugin-sdk";
import { createContext, useContext, useMemo } from "react";
import { IApp, IComponentAuthConfig, IMenuAuthConfig, IUiFrame } from "model";
import { IUserConfig } from "model/user";
import { IMenuItem } from "../model";

export type IComponents = Record<string, JSXComponent>;
export interface IAppContextParams {
  app: IApp,
  device: Device | undefined,
  userConfig?: IUserConfig,
  uiFrame?: IUiFrame,
  components: IComponents,
  pageCache?: boolean,
  menuAuthConfigs?: IMenuAuthConfig[],
  componentAuthConfigs?: IComponentAuthConfig[],
}
export const AppContext = createContext<IAppContextParams>({} as any);
export const useUserConfig = (): IUserConfig | undefined => useContext(AppContext)?.userConfig;
export const useAppParams = (): IAppContextParams => useContext(AppContext) || {};
export const useApp = (): IApp | undefined => useContext(AppContext)?.app;

export const useAppViewKey = () => {
  const params = useAppParams()

  const key = useMemo(() => {
    return params ? params.device + params.app?.uuid : ""
  }, [params])

  return key;
}

export interface IMenuRoute {
  menuItem?: IMenuItem,
  setMenuItem?: React.Dispatch<React.SetStateAction<IMenuItem>>,
}
export const RouteContext = createContext<IMenuRoute | undefined>(undefined);
export const useMenuRoute = (): IMenuRoute | undefined => useContext(RouteContext);
