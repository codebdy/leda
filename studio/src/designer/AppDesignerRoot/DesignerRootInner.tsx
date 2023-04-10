import { Spin } from 'antd'
import React, { memo, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryLangLocales } from '../hooks/useQueryLangLocales'
import { useQueryAppConfig } from '../hooks/useQueryAppConfig'
import { useShowError } from 'designer/hooks/useShowError'
import { DesignerContext } from 'plugin-sdk/contexts/desinger'
import { useQueryAppDeviceConfig } from '../hooks/useQueryAppDeviceConfig'
import { useMe } from 'plugin-sdk/contexts/login'
import { Device } from '@rxdrag/appx-plugin-sdk'
import { useQueryMaterialConfig } from './hooks/useQueryMaterialConfig'
import { IApp, } from 'model'
export const DesignerRootInner = memo((
  props: {
    app: IApp,
    children: React.ReactNode
  }
) => {
  const { app } = props;
  const { device = Device.PC } = useParams();
  const me = useMe();
  const appId = app.id;
  const { config, loading: configLoading, error: configError } = useQueryAppConfig(appId);
  const { deviceConfig, loading: deviceLoading, error: deviceError } = useQueryAppDeviceConfig(appId, device as any)
  const { langLocales, loading: localLoading, error: localError } = useQueryLangLocales(appId);
  //const { userConfig, loading: userConfigLoading, error: userConfigError } = useQueryUserConfig(appId, device as any, me?.id)
  const { materialConfig, loading: materialConfigLoading, error: materialConfigError } = useQueryMaterialConfig(appId, device as any)
  //const { plugins, loading: pluginLoading, error: pluginError } = useIntalledPlugins(appId);
  useShowError(configError || localError || deviceError || materialConfigError);

  // const debugPlugins = useMemo(
  //   () => plugins?.filter(plugin => plugin.pluginInfo?.type === PluginType.debug) || [],
  //   [plugins]);

  const contextValue = useMemo(() => {
    return {
      app: app,
      device: device as Device,
      config,
      langLocales,
      deviceConfig: deviceConfig,
      //userConfig,
      // uploadedPlugins: plugins?.filter(plugin => plugin.pluginInfo?.type === PluginType.uploaded) || [],
      // debugPlugins: debugPlugins,
      materialConfig
    }
  }, [config, device, deviceConfig, langLocales, materialConfig, app])


  return (
    app ?
      <DesignerContext.Provider
        value={contextValue}
      >
        <Spin
          style={{ height: "100vh" }}
          spinning={
            configLoading ||
            localLoading ||
            deviceLoading ||
            materialConfigLoading
          }
        >
          {props.children}
        </Spin>
      </DesignerContext.Provider>
      : <></>
  )
})



