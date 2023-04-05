import { ID } from "shared";
import { IApp, IAppInput } from "./app";

export enum PluginType {
  uploaded = "uploaded",
  debug = "debug",
  market = "market"
}

export interface IPluginInfo {
  id?: ID;
  app?: IApp;
  title?: string;
  url?: string;
  pluginId?: string,
  type?: PluginType,
  description?: string,
  version?: string,
}


export interface IPluginInfoInput {
  id?: ID;
  app?: {
    sync: IAppInput
  };
  title?: string;
  url?: string;
  type?: PluginType,
  description?: string;
  version?: string;
  pluginId: string;
}
