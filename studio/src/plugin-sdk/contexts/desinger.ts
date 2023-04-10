import { Device } from "@rxdrag/appx-plugin-sdk";
import { createContext, useContext, useMemo } from "react";
import { IApp, IAppConfig, IAppDeviceConfig, ILangLocal, IMaterialConfig } from "model";


export interface IDesignerContextParams {
  app: IApp,
  device: Device | undefined,
  config: IAppConfig | undefined,
  deviceConfig: IAppDeviceConfig | undefined,
  langLocales: ILangLocal[] | undefined,
  //uploadedPlugins?: IInstalledPlugin[],
  //debugPlugins?: IInstalledPlugin[],
  materialConfig?: IMaterialConfig,
}

export const DesignerContext = createContext<IDesignerContextParams>({} as any);

export const useDesignerParams = (): IDesignerContextParams => useContext(DesignerContext);
export const useDesignerAppConfig = (): IAppConfig | undefined => useContext(DesignerContext)?.config;

export const useDesignerViewKey = () => {
  const params = useDesignerParams()

  const key = useMemo(() => {
    return params ? params.device + params.app.uuid : ""
  }, [params])

  return key;
}

export function useSelectedAppId() {
  return useDesignerParams()?.app?.id
}