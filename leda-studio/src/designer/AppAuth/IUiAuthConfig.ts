import { Device } from "@rxdrag/appx-plugin-sdk";
import { IMenuAuthConfig, IComponentAuthConfig } from "model";

export interface IUiAuthRow {
  name: string;
  label?: string;
  refused?: boolean;
  menuItemUuid?: string;
  componentId?: string;
  menuConfig?: IMenuAuthConfig;
  device: Device;
  componentConfig?: IComponentAuthConfig;
}
