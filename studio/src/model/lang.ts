import { ID } from "shared";
import { IApp, IAppInput } from "./app";

export interface ILang {
  key: string,
  abbr: string,
}

export interface ILangLocal {
  id: ID;
  name: string;
  app?: IApp;
  schemaJson?: any;
}

export interface ILangLocalInput {
  id?: ID;
  name?: string;
  app?: {
    sync: IAppInput
  };
  schemaJson?: any;
}

