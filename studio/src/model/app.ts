import { Device } from "@rxdrag/appx-plugin-sdk";
import { MetaContent } from "designer/AppUml/meta";
import { ID } from "shared";
import { ILang, ILangLocal } from "./lang";
import { IMenu } from "./menu";
import { IPluginInfo } from "./plugin";

export interface IAppConfig {
  id: ID;
  app?: IApp;
  schemaJson?: {
    multiLang: {
      open?: boolean,
      langs?: ILang[],
    }
  }
}

export interface IAppDeviceConfig {
  id: ID;
  app?: IApp;
  device?: Device;
  schemaJson?: {
    entryUuid?: string,
    pageFrameUuid?: string,
  }
}


export interface IAppConfigInput {
  id?: ID;
  app?: {
    sync: IAppInput
  };
  schemaJson?: {
    multiLang?: {
      open?: boolean,
      langs?: ILang[],
    }
  }
}

export interface IAppDeviceConfigInput {
  id?: ID;
  app?: {
    sync: IAppInput
  };
  device?: Device;
  published?: boolean;
  schemaJson?: {
    entryId?: string,
  }
}


export interface IApp {
  id: ID;
  uuid: string;
  title?: string;
  imageUrl?: string;
  partsOfMenu?: IMenu[];
  partsOfLangLocal?:ILangLocal[];
  partsOfAppConfig?: IAppConfig[];
  partsOfAppDeviceConfig?:IAppDeviceConfig[];
  plugins?:IPluginInfo[]
  meta?: MetaContent;
  saveMetaAt?: Date;
  publishedMeta?: MetaContent;
  publishMetaAt?: Date;
  deviceConfigs?: IAppDeviceConfig[];
  published?: boolean;
}

export interface IAppInput {
  id?: ID;
  uuid?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  meta?: MetaContent;
  saveMetaAt?: Date;
  publishedMeta?: MetaContent;
  publishMetaAt?: Date;
  published?: boolean;
}