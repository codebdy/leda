import { IClassAuthConfig, IPropertyAuthConfig } from "model";

export enum RowType {
  Package,
  Class,
  Property,
}

export interface IAuthRow {
  classUuid?: string;
  propertyUuid?: string;
  rowType: RowType;
  classConfig?: IClassAuthConfig;
  propertyConfig?: IPropertyAuthConfig;
}


