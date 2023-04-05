import { Type } from "./Type";

export interface ArgMeta {
  uuid: string;
  name: string;
  label?: string;
  type: Type;
  typeUuid?: string;
  /**
   * 渲染图形元素用的label，其他地方毫无用处
   */
  typeLabel?: string;
  index?: number;
}

export enum MethodOperateType {
  Query = "query",
  Mutation = "mutation"
}

// export enum MethodImplementType {
//   Script = "script",
//   CloudFunction = "cloudFunction",
//   MicroService = "microService",
// }

export interface MethodMeta {
  /**
   * 唯一标识
   */
  uuid: string;

  /**
   * 字段名
   */
  name: string;

  label?: string;
  description?: string;
  /**
   * 字段类型
   */
  type: Type;

  /**
   * 类型uuid
   */
  typeUuid?: string;

  args: ArgMeta[];

  /**
   * 渲染图形元素用的label，其他地方毫无用处
   */
  typeLabel: string;

  operateType: MethodOperateType;

  //implementType: MethodImplementType;
  script?: string;

  system?: boolean;
}
