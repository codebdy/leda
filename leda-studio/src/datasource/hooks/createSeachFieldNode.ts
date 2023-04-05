import { Kind } from "graphql";
import { ISearchText } from "plugins/inputs/components/pc/SearchInput/view";
import { createObjectFieldNode } from "./createObjectFieldNode";

export function createSeachFieldNode(searchText: ISearchText) {

  const fieldNodes = searchText.fields?.map((field) => {
    if (searchText.isFuzzy) {
      return createObjectFieldNode(field, "_like", `%${searchText.keyword || ""}%`)
    } else {
      return createObjectFieldNode(field, "_eq", searchText.keyword)
    }
  })
  if (fieldNodes?.length === 0) {
    return null
  }
  if (fieldNodes?.length === 1) {
    return fieldNodes[0];
  } else {
    const orField = {
      kind: Kind.OBJECT_FIELD,
      name: {
        kind: Kind.NAME,
        value: "_or",
      },
      value: {
        kind: Kind.LIST,
        values: fieldNodes?.map((field) => {
          return {
            kind: Kind.OBJECT,
            fields: [field],
          }
        }),
      }
    }
    return {
      kind: Kind.OBJECT_FIELD,
      name: {
        kind: Kind.NAME,
        value: "_and",
      },
      value: {
        kind: Kind.LIST,
        values:[
          {
            kind: Kind.OBJECT,
            fields: [orField]
          }
        ]
      }
    };
  }
}