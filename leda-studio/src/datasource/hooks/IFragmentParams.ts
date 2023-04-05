import { IOrderBy } from "../model/IOrderBy";

export interface IFragmentParams {
  gql?: string;
  variables?: any;
  orderBys?: IOrderBy[];
}
