import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { classesState } from "../../AppUml/recoil/atoms";
import { ID } from "shared";
import { StereoType } from "../../AppUml/meta/ClassMeta";

export function useGetPackageCanAuthClasses(appId:ID) {

  const classes = useRecoilValue(classesState(appId));

  const getClasses = useCallback((packageUuid: ID) => {
    return classes.filter(
      cls => cls.packageUuid === packageUuid &&
        (cls.stereoType === StereoType.Entity ||
          //cls.stereoType === StereoType.Service ||
          cls.stereoType === StereoType.ThirdParty
        ))
  }, [classes])

  return getClasses;
}