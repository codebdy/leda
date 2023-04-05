import { IUser } from "enthooks";
import { ID } from "shared";
import { IApp, IAppInput } from "./app";
import { IUserInput } from "./user";

export interface INotification {
  id: ID;
  text?: string;
  createdAt?: Date;
  read?: boolean;
  noticeType?: string;
  app?: IApp;
  user?: IUser;
}

export interface INotificationInput {
  id?: ID;
  text?: string;
  createdAt?: Date;
  read?: boolean;
  noticeType?: string;
  app?: { sync: IAppInput };
  user?: { sync: IUserInput };
}