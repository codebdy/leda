import { isArr, isBool, isNum, isObj, isStr } from "@formily/shared";
import { BooleanValueNode, EnumValueNode, FloatValueNode, IntValueNode, Kind, ListValueNode, NullValueNode, ObjectValueNode, StringValueNode } from "graphql";


export const createObjectValueNode = (value: any): IntValueNode |
  FloatValueNode |
  StringValueNode |
  BooleanValueNode |
  NullValueNode |
  EnumValueNode |
  ListValueNode |
  ObjectValueNode => {
  if (value === undefined) {
    return {
      kind: Kind.NULL,
    };
  }

  if (isStr(value)) {
    return {
      kind: Kind.STRING,
      value,
      block: false,
    };
  }

  if (isArr(value)) {
    return {
      kind: Kind.LIST,
      values: value.map(subValue => createObjectValueNode(subValue)),
    };
  }

  if (isBool(value)) {
    return {
      kind: Kind.BOOLEAN,
      value,
    };
  }

  if (isNum(value)) {
    return {
      kind: Kind.INT,
      value: value as any,
    };
  }

  if ((value.toString().indexOf(".") !== -1)) {
    return {
      kind: Kind.FLOAT,
      value: value as any,
    };
  }

  if (isObj(value)) {
    return {
      kind: Kind.OBJECT,
      fields: Object.keys(value).map((key) => {
        return {
          kind: Kind.OBJECT_FIELD,
          name: {
            kind: Kind.NAME,
            value: key
          },
          value: createObjectValueNode((value as any)[key]),
        };
      })
    };
  }

  throw new Error("can not process type value:" + value);
};
