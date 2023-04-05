import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { StereoType } from "../meta/ClassMeta";
import { classesState } from "../recoil/atoms";

export function useValueObjects(appId: ID) {
  const classes = useRecoilValue(classesState(appId));
  const valueObjs = useMemo(() => {
    return classes.filter((cls) => cls.stereoType === StereoType.ValueObject);
  }, [classes]);

  return valueObjs;
}
