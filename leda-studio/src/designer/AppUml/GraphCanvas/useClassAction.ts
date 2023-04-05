import { Graph } from "@antv/x6";
import { useCallback, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { ID } from "shared";
import { useChangeClass } from "../hooks/useChangeClass";
import { useCreateClassAttribute } from "../hooks/useCreateClassAttribute";
import { useCreateClassMethod } from "../hooks/useCreateClassMethod";
import { useDeleteClass } from "../hooks/useDeleteClass";
import { useGetClass } from "../hooks/useGetClass";
import { useHideClassFromDiagram } from "../hooks/useHideClassFromDiagram";
import { selectedElementState } from "../recoil/atoms";
import { ClassEvent, IClassEventData } from "./ClassView";

export function useClassAction(graph: Graph | undefined, appId: ID) {
  const getClass = useGetClass(appId);
  const setSelectedElement = useSetRecoilState(
    selectedElementState(appId)
  );
  const changeClass = useChangeClass(appId);
  const createAttribute = useCreateClassAttribute(appId);
  const createMethod = useCreateClassMethod(appId);

  const getClassRef = useRef(getClass);
  getClassRef.current = getClass;
  const hideClass = useHideClassFromDiagram(appId);
  const hideClassRef = useRef(hideClass);
  hideClassRef.current = hideClass;

  const deleteClass = useDeleteClass(appId);
  const deleteClassRef = useRef(deleteClass);
  deleteClassRef.current = deleteClass;

  const changeClassRef = useRef(changeClass);
  changeClassRef.current = changeClass;

  const createAttributeRef = useRef(createAttribute);
  createAttributeRef.current = createAttribute;

  const createMothodRef = useRef(createMethod);
  createMothodRef.current = createMethod;

  const handleAttributeSelect = useCallback(
    (e: CustomEvent<IClassEventData>) => {
      setSelectedElement(e.detail?.attrId);
    },
    [setSelectedElement]
  );

  const handleAttributeDelete = useCallback(
    (e: CustomEvent<IClassEventData>) => {
      const cls = getClassRef.current(e.detail.classId);
      if (!cls) {
        console.error("Class not exist: " + e.detail.classId);
        return;
      }
      changeClassRef.current({
        ...cls,
        attributes: cls.attributes.filter((ent) => ent.uuid !== e.detail.attrId),
      });
    },
    []
  );

  const handleMethodSelect = useCallback(
    (e: CustomEvent<IClassEventData>) => {
      setSelectedElement(e.detail.methodId);
    },
    [setSelectedElement]
  );

  const handleMothodDelete = useCallback(
    (e: CustomEvent<IClassEventData>) => {
      const cls = getClassRef.current(e.detail.classId);
      if (!cls) {
        console.error("Class not exist: " + e.detail.classId);
        return;
      }
      changeClassRef.current({
        ...cls,
        methods: cls.methods.filter((cls) => cls.uuid !== e.detail.methodId),
      });
    },
    []
  );

  const handleAttributeCreate = useCallback((e: CustomEvent<IClassEventData>) => {
    const cls = getClassRef.current(e.detail.classId);
    if (!cls) {
      console.error("Class not exist: " + e.detail.classId);
      return;
    }
    const attr = createAttributeRef.current(cls);
    setSelectedElement(attr?.uuid)
  }, [setSelectedElement]);

  const handleMethodCreate = useCallback((e: CustomEvent<IClassEventData>) => {
    const cls = getClassRef.current(e.detail.classId);
    if (!cls) {
      console.error("Class not exist: " + e.detail.classId);
      return;
    }
    createMothodRef.current(cls);
  }, []);

  const handleHideClass = useCallback(
    (e: CustomEvent<IClassEventData>) => {
      hideClassRef.current && hideClassRef.current(e.detail.classId)
    },
    []
  );

  const handelDeleteClass = useCallback(
    (e: CustomEvent<IClassEventData>) => {
      deleteClassRef.current && deleteClassRef.current(e.detail.classId);
    },
    []
  );

  useEffect(() => {
    document.addEventListener(ClassEvent.attributeSelect, handleAttributeSelect as any)
    document.addEventListener(ClassEvent.attributeDelete, handleAttributeDelete as any);
    document.addEventListener(ClassEvent.attributeCreate, handleAttributeCreate as any);
    document.addEventListener(ClassEvent.methodSelect, handleMethodSelect as any);
    document.addEventListener(ClassEvent.methodDelete, handleMothodDelete as any);
    document.addEventListener(ClassEvent.methodCreate, handleMethodCreate as any);
    document.addEventListener(ClassEvent.delete, handelDeleteClass as any);
    document.addEventListener(ClassEvent.hide, handleHideClass as any);
    return () => {
      document.removeEventListener(ClassEvent.attributeSelect, handleAttributeSelect as any)
      document.removeEventListener(ClassEvent.attributeDelete, handleAttributeDelete as any);
      document.removeEventListener(ClassEvent.attributeCreate, handleAttributeCreate as any);
      document.removeEventListener(ClassEvent.methodSelect, handleMethodSelect as any);
      document.removeEventListener(ClassEvent.methodDelete, handleMothodDelete as any);
      document.removeEventListener(ClassEvent.methodCreate, handleMethodCreate as any);
      document.removeEventListener(ClassEvent.delete, handelDeleteClass as any);
      document.removeEventListener(ClassEvent.hide, handleHideClass as any);
    };
  }, [graph, handelDeleteClass, handleAttributeCreate, handleAttributeDelete, handleAttributeSelect, handleHideClass, handleMethodCreate, handleMethodSelect, handleMothodDelete]);
}