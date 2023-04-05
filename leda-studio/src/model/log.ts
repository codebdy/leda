import { IUser } from "../enthooks";
import { ID } from "shared";
import { IApp } from "./app";

export enum ModelOperateType {
  query = "query",
  upsert = "upsert",
  delete = "delete",
  inovkeMethod = "inovkeMethod"
}

export enum OperateResult {
  success = "success",
  failure = "failure",
}

export interface IModelLog {
  id: ID;
  user?: IUser;
  ip?: string;
  app?: IApp;
  createdAt?: Date;
  operateType?: ModelOperateType;
  classUuid?: string;
  className?: string;
  gql?: string;
  result?: OperateResult;
  message?: string;
}
export enum BusinessOperateType {
  login = "login",
  logout = "logout",
  deployProcess = "deployProcess",
  startProcess = "startProcess",
  complateJob = "complateJob",
  publishMeta = "publishMeta",
  install = "install",
}

export interface IBusinessLog {
  id: ID;
  user?: IUser;
  ip?: string;
  app?: IApp;
  createdAt?: Date;
  operateType?: BusinessOperateType;
  result?: OperateResult;
  message?: string;
}