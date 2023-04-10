import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { packagesState } from './../recoil/atoms';

export function useGetPackageByName(appId: ID) {
  const packages = useRecoilValue(packagesState(appId));
  const getPackageByName = useCallback((name: string) => {
    return packages.find((pkg) => pkg.name === name);
  }, [packages]);

  return getPackageByName;
}
