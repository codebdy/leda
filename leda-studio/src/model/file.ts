import { ID } from "shared";

export interface IFile {
  id: ID;
  thumbUrl: string;
}

export interface IFileInput {
  id?: ID;
  thumbUrl?: string;
}