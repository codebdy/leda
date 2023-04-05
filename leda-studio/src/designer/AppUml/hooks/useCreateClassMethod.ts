import { useCallback } from "react";
import { ID } from "shared";
import { ClassMeta } from "../meta/ClassMeta";
import { useChangeClass } from "./useChangeClass";
import { useCreateMethod } from "./useCreateMethod";

export function useCreateClassMethod(appId: ID) {
  const changeClass = useChangeClass(appId);
  const createMethod = useCreateMethod(appId);
  const createClassMethod = useCallback(
    (cls: ClassMeta) => {
      const method = createMethod(cls.methods);

      changeClass({ ...cls, methods: [...cls.methods||[], method] });
    },
    [changeClass, createMethod]
  );

  return createClassMethod;
}
