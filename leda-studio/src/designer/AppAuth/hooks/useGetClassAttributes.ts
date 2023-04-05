import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { classesState, relationsState } from "../../AppUml/recoil/atoms";
import { getParentClasses } from "datasource/hooks/getParentClasses";
import { AttributeMeta, ClassMeta, CONST_ID } from "../../AppUml/meta";
import { sort } from "datasource";
import _ from "lodash";
import { ID } from "shared";

export function useGetClassAttributes(appId?: ID) {
  const classMetas = useRecoilValue(classesState(appId||""))
  const relations = useRecoilValue(relationsState(appId||""));
  const getAttrs = useCallback((cls: ClassMeta) => {
    const parentClasses = getParentClasses(cls.uuid, classMetas, relations);
    const parentAttributes: AttributeMeta[] = [];

    for (const parentCls of parentClasses) {
      parentAttributes.push(...parentCls.attributes || []);
    }

    const attrs = [...cls.attributes || [], ...parentAttributes].filter(attr => attr.name !== CONST_ID)

    return sort(_.uniqBy(attrs, "name"))
  }, [classMetas, relations])

  return getAttrs;
}