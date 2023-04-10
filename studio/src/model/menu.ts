import { Device } from "@rxdrag/appx-plugin-sdk";
import { IMenuItem } from "plugin-sdk";
import { ID } from "shared";
import { IApp, IAppInput } from "./app";

export interface IMenu {
  id: ID;
  schemaJson: { items: IMenuItem[] };
  device: Device;
  app: IApp;
}

export interface IMenuInput {
  id?: ID;
  device?: Device;
  schemaJson?: any;
  app?: { sync: IAppInput };
}
