import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { createUuid, ID } from "shared";
import { PackageMeta, PackageStereoType } from "../meta/PackageMeta";
import { packagesState } from './../recoil/atoms';

export function useCreateNewPackage(appId: ID) {
  const packages = useRecoilValue(packagesState(appId));
  const { t } = useTranslation();
  const getNewPackageName = useCallback(() => {
    const prefix = t("AppUml.NewPackage");
    let index = 1;
    // eslint-disable-next-line no-loop-func
    while (packages.find((pkg) => pkg.name === (prefix + index))) {
      index++;
    }

    return prefix + index;
  }, [packages, t]);

  const createNewPackage = useCallback(
    () => {
      const newPackage: PackageMeta = {
        uuid: createUuid(),
        name: getNewPackageName(),
        stereoType: PackageStereoType.Normal,
      };
      return newPackage;
    },
    [getNewPackageName]
  );

  return createNewPackage;
}
