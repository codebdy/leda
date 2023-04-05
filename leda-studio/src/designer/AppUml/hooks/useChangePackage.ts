import { useCallback } from "react"
import { useSetRecoilState } from "recoil";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { PackageMeta } from "../meta/PackageMeta";
import { packagesState } from "../recoil/atoms";

export function useChangePackage() {
  const appId = useEdittingAppId();
  const setPackages = useSetRecoilState(packagesState(appId));
  const change = useCallback((pkg: PackageMeta) => {
    setPackages(packages => packages.map(pg => pg.uuid === pkg.uuid ? pkg : pg))
  }, [setPackages])

  return change;
}