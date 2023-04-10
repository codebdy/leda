import { ID } from "shared";

export interface IRole {
  id: ID,
  name: string,
}

export interface IRoleInput {
  id?: ID,
  name?: string,
}