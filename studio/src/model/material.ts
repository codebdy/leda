import { Device, IMaterialTab } from "@rxdrag/appx-plugin-sdk";
import { ID } from "shared";
import { IApp, IAppInput } from "./app";

export interface IMaterialConfigInput {
  id?: ID;
  device?: Device,
  app?: { sync?: IAppInput }
  schemaJson?: {
    tabs: IMaterialTab[],
  },
}

export interface IMaterialConfig {
  id: ID;
  app?: IApp;
  schemaJson?: {
    tabs: IMaterialTab[],
  },
}