import { Device } from "@rxdrag/appx-plugin-sdk";
import { ID } from "shared";
import { IApp, IAppInput } from "./app";

export enum CategoryType {
  Public = "Public",
  Local = "Local"
}

export enum TemplateType {
  Frame = "Frame",
  Page = "Page"
}

export interface ElementsJson {
  elements?: any[]
}

export interface ITemplateInfo {
  id?: ID;
  name?: string;
  imageUrl?: string;
  dependencies?: any;
  schemaJson?: ElementsJson;
  app?: IApp;
  device?: Device;
  categoryType?: CategoryType;
  templateType?: TemplateType;
}

export interface ITemplateInfoInput {
  id?: ID;
  name?: string;
  imageUrl?: string;
  dependencies?: any;
  schemaJson?: ElementsJson;
  app: { sync: IAppInput };
  device?: Device;
  categoryType: CategoryType;
  templateType: TemplateType;
}
