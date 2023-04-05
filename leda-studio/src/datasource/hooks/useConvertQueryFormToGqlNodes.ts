import { isArr, isObj, isStr } from "@formily/shared";
import { ObjectFieldNode } from "graphql";
import { useCallback } from "react";
import { ISearchText } from "plugins/inputs/components/pc/SearchInput/view";
import { IQueryForm } from "../model/IQueryForm";
import { createObjectFieldNode } from "./createObjectFieldNode";
import { createSeachFieldNode } from "./createSeachFieldNode";

export function useConvertQueryFormToGqlNodes() {
  const convert = useCallback((queryForm?: IQueryForm): ObjectFieldNode[] => {
    if (!queryForm) {
      return [];
    }
    const whereNodes: ObjectFieldNode[] = [];
    for (const key of Object.keys(queryForm)) {
      const value = queryForm[key];
      if (isObj(value)) {
        const anyValue = value as any;
        if (anyValue?.start || anyValue?.end) {
          const rangeValue = value as any//IRangeValue
          if (rangeValue?.start) {
            const gtOp = rangeValue.startWithEqual ? "_gte" : "_gt";
            whereNodes.push(createObjectFieldNode(key, gtOp, value));
          }
          if (rangeValue?.end) {
            const ltOp = rangeValue.startWithEqual ? "_lte" : "_lt";
            whereNodes.push(createObjectFieldNode(key, ltOp, value));
          }
        } else if (anyValue.isSearchText) {
          const searchText = anyValue as ISearchText;
          if(!searchText?.fields?.length){
            console.error("Not set fields to search box")
          }
          if (searchText.keyword && searchText?.fields?.length) {
            whereNodes.push(createSeachFieldNode(value as any) as any);
          }
        } else {
          whereNodes.push(createObjectFieldNode(key, "_eq", value));
        }
      } else if (isArr(value)) {
        whereNodes.push(createObjectFieldNode(key, "_in", value?.map(v => v?.id)));
      } else if (isStr(value) && value.trim()) {
        whereNodes.push(createObjectFieldNode(key, "_eq", value.trim()));
      } else if (value) {
        whereNodes.push(createObjectFieldNode(key, "_eq", value));
      }
    }
    return whereNodes;
  }, []);

  return convert;
}