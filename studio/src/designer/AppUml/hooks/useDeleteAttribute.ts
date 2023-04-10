import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { classesState } from "../recoil/atoms";
import { useChangeClass } from "./useChangeClass";

export function useDeleteAttribute(appId: ID) {
  const changeClass = useChangeClass(appId);
  const clses = useRecoilValue(classesState(appId))

  const deleteAttribute = useCallback(
    (attributeUuid: string) => {
      for(const cls of clses){
        if(cls.attributes.find((attr) => attr.uuid === attributeUuid)){
          changeClass({
            ...cls,
            attributes: cls.attributes.filter(
              (atr) => atr.uuid !== attributeUuid
            ),
          })
        }
      }
    },
    [changeClass, clses]
  );

  return deleteAttribute;
}
