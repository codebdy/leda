export enum Events {
  onClick = "onClick",
  onSearch = "onSearch"
}

export enum ActionType {
  OpenPage = "OpenPage",
  ClosePage = "ClosePage",
  OpenDialog = "OpenDialog",
  CloseDialog = "CloseDialog",
  Navigate = "Navigate",
  WindowOpen = "WindowOpen",
  //OpenDrawer = "OpenDrawer",
  //CloseDrawer = "CloseDrawer",
  Confirm = "Confirm",
  SuccessMessage = "SuccessMessage",
  DeleteData = "DeleteData",
  SaveData = "SaveData",
  BatchUpdate = "BatchUpdate",
  BatchDelete = "BatchDelete",
  Reset = "Reset",
  Customized = "Customized",
  SubmitSearch = "SubmitSearch",
  OpenFile = "OpenFile",
  Graphql = "Graphql"
}

export enum OpenPageType {
  RouteTo = "RouteTo",
  Dialog = "Dialog",
  Drawer = "Drawer"
}

export interface IOpenPageAction {
  openType: OpenPageType,
  pageUuid?: string,
  width?: number | string;
  height?: number | string;
  placement?: "top" | "right" | "bottom" | "left";
  pageTitle?: string;
}

export interface ISuccessAction {
  message?: string;
}

export interface IConfirmAction {
  boxTitle?: string;
  message?: string;
}

export interface IRouteAction {
  route?: string;
}

export interface IOpenFileAction {
  multiple?: boolean;
  description?: string;
  accept?: string;
  variableName?: string;
}

export interface IGraphqlAction {
  gqlScript?: string;
  affectedEntities?: string;
}

export interface IAppxAction {
  uuid: string,
  title: string,
  actionType: ActionType,
  payload?: IOpenPageAction | ISuccessAction | IConfirmAction | IRouteAction | IOpenFileAction | IGraphqlAction,
}