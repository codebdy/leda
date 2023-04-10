import { createContext, useContext } from "react";
import { SYSTEM_APP_ID } from "consts";

export interface IEntxConfig {
  token?: string,
  tokenName: string,
  endpoint: string,
  appId?: string,
  setToken: (token: string | undefined) => void,
  setEndpoint: (endpoint: string) => void,
}

export const empertyConfig = {
  endpoint: "",
  tokenName: "",
  appId: SYSTEM_APP_ID,
  setToken: () => {
    throw new Error("Not implement setToken")
  },
  setEndpoint: () => {
    throw new Error("Not implement setEndpoint")
  }
}

export const EntixContext = createContext<IEntxConfig>(empertyConfig);

export const useEntix = (): IEntxConfig => useContext(EntixContext);

export const useToken = () => {
  const iEntx = useEntix();
  return iEntx?.token || localStorage.getItem(iEntx.tokenName)
}

export const useSetToken = () => {
  const iEntx = useEntix();
  return iEntx?.setToken
}

export const useEndpoint = () => {
  const iEntx = useEntix();
  return iEntx?.endpoint
}

export const useEnthooksAppId = () => {
  const iEntx = useEntix();
  return iEntx?.appId
}

export const useSetEndpoint = () => {
  const iEntx = useEntix();
  return iEntx?.setEndpoint;
}