import { Device } from "@rxdrag/appx-plugin-sdk";
import { ID } from "shared";
import { IApp, IAppInput } from "./app";

export interface IUiFrame {
  id: ID;
  title: string;
  uuid: string;
  schemaJson: { form: any, schema: any/*ISchema*/ };
  device: Device;
  app?: IApp;
}

export interface IUiFrameInput {
  id?: ID;
  title?: string;
  uuid?: string;
  schemaJson?: any;
  device?: Device;
  app?: { sync: IAppInput };
}
