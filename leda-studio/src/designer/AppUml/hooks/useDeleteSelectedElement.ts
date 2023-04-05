import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { selectedElementState } from "../recoil/atoms";
import { useAttribute } from "./useAttribute";
import { useDeleteAttribute } from "./useDeleteAttribute";
import { useDeleteClass } from "./useDeleteClass";
import { useDeleteRelation } from "./useDeleteRelation";
import { useClass } from "./useClass";
import { useRelation } from "./useRelation";
import { useMethod } from "./useMethod";
import { useDeleteMethod } from "./useDeleteMethod";
import { ID } from "shared";

/**
 * 本方法不需要备份状态
 */
export function useDeleteSelectedElement(appId: ID) {
  const [selectedElement, setSelectedElement] = useRecoilState(
    selectedElementState(appId)
  );
  const cls = useClass(selectedElement || "", appId);
  const deleteClass = useDeleteClass(appId);
  const relation = useRelation(selectedElement || "", appId);
  const deleteRelation = useDeleteRelation(appId);

  const { attribute } = useAttribute(selectedElement || "", appId);
  const { method } = useMethod(selectedElement || "", appId);
  const deletedAttribute = useDeleteAttribute(appId);
  const deleteMethod = useDeleteMethod(appId);

  const deleteSelectedElement = useCallback(() => {
    if (cls) {
      deleteClass(cls.uuid);
    }
    if (relation) {
      deleteRelation(relation.uuid);
    }

    if (attribute) {
      deletedAttribute(attribute.uuid);
    }

    if (method) {
      deleteMethod(method.uuid);
    }
    setSelectedElement(undefined);
  }, [
    cls,
    relation,
    attribute,
    method,
    setSelectedElement,
    deleteClass,
    deleteRelation,
    deletedAttribute,
    deleteMethod,
  ]);

  return deleteSelectedElement;
}
