import { IUser } from "enthooks";
import { ID } from "shared";
import { IApp, IAppInput } from "./app";

export interface IUserInput {
  id?: ID;
}

export interface IUserConfig {
  id: ID;
  app?: IApp,
  user?: IUser;
  schemaJson?: {
    [path: string]: any,
  },
}

export interface IUserConfigInput {
  id?: ID;
  app?: { sync: IAppInput };
  user?: { sync: IUserInput };
  schemaJson?: {
    [path: string]: any,
  },
}

