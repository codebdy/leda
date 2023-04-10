import { Device } from "@rxdrag/appx-plugin-sdk";
import { ID } from "shared";
import { IApp } from "./app";

export interface IAuthConfig {
  id: ID;
  app?: IApp;
  roleId: ID;
}

export interface IModelAuthConfig extends IAuthConfig {
  canRead?: boolean;
  readExpression?: string;
  canUpdate?: boolean;
  updateExpression?: string;
  canDelete?: boolean;
  deleteExpression?: string;
}

export interface IClassAuthConfig extends IModelAuthConfig {
  expanded?: boolean;
  canCreate?: boolean;
  createExpression?: string;
  classUuid?: string;
}

export interface IPropertyAuthConfig extends IModelAuthConfig {
  propertyUuid?: string;
}

// input
export interface IAuthConfigInput {
  id?: ID;
  app?: {
    sync?:{
      id: ID;
    }
  };
  roleId?: ID;
}

export interface IModelAuthConfigInput extends IAuthConfigInput {
  canRead?: boolean;
  readExpression?: string;
  canUpdate?: boolean;
  updateExpression?: string;
  canDelete?: boolean;
  deleteExpression?: string;
  classUuid?: string;
}

export interface IClassAuthConfigInput extends IModelAuthConfigInput {
  expanded?: boolean;
  canCreate?: boolean;
  createExpression?: string;
}

export interface IPropertyAuthConfigInput extends IModelAuthConfigInput {
  propertyUuid?: string;
}

export interface IUiAuthConfig extends IAuthConfig{
  device: Device;
  refused?: Boolean;
}

export interface IUiAuthConfigInput extends IAuthConfigInput{
  device: Device;
  refused?: Boolean;
}


export interface IMenuAuthConfig extends IUiAuthConfig {
  menuItemUuid: string;
}

export interface IMenuAuthConfigInput extends IUiAuthConfigInput {
  menuItemUuid?: string;
}


export interface IComponentAuthConfig extends IUiAuthConfig {
  componentId: string;
}


export interface IComponentAuthConfigIput extends IUiAuthConfigInput {
  componentId?: string;
}
