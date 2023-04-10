import { IIcon } from "../icon/model";

export enum MenuItemType {
  Group = "Group",
  Divider = "Divider",
  Link = "Link",
  Item = "Item",
}

export interface IMenuBadge {
  color?: "primary" | "secondary" | "default";
  field?: string;
  size?: "small" | "medium";
}

export interface IMenuItem {
  uuid: string;
  type: MenuItemType;
  title?: string;
  icon?: IIcon;
  badge?: IMenuBadge;
  //chip?:IMenuChip,
  children?: IMenuItem[];
  link?: string;
  //auths?: RxAuth[];
  route?: {
    pageUuid?: string;
    payload?: any;
  };
}

export interface IMenuNode {
  parentId?: string;
  childIds: string[];
  meta: IMenuItem;
}
