import { ID } from "shared";

export interface ISnapshot{
  id:ID;
  version: string;
  description?: string;
  createdAt: Date;
  instanceId: ID;
}