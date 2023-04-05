import { Kind, ObjectFieldNode } from "graphql";
import { createObjectValueNode } from "./createObjectValueNode";

export const createObjectFieldNode = (name: string, operator: string, value: any): ObjectFieldNode => {
  return {
    kind: Kind.OBJECT_FIELD,
    name: {
      kind: Kind.NAME,
      value: name,
    },
    value: {
      kind: Kind.OBJECT,
      fields: [
        {
          kind: Kind.OBJECT_FIELD,
          name: {
            kind: Kind.NAME,
            value: operator
          },
          value: createObjectValueNode(value)
        }
      ]
    }
  };
};
