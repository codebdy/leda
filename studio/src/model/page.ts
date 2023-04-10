import { Device } from "@rxdrag/appx-plugin-sdk";
import { ID } from "shared";
import { IApp, IAppInput } from "./app";

export interface IPageCategory {
  id: ID;
  title?: string;
  device?: Device;
  app?: IApp;
  uuid: string;
}


export interface IPage {
  id: ID;
  title: string;
  schemaJson: { form: any, schema: any/* ISchema */ };
  device: Device;
  app?: IApp;
  categoryUuid?: string;
  uuid: string;
}

export interface IPageCategoryInput {
  id?: ID;
  title?: string;
  device?: Device;
  app?: { sync: IAppInput };
  uuid?: string;
}

export interface IPageInput {
  id?: ID;
  title?: string;
  schemaJson?: any;
  device?: Device;
  app?: { sync: IAppInput };
  categoryUuid?: string;
  uuid?: string;
}
