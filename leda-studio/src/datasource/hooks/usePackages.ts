import { useRecoilValue } from "recoil";
import { useSelectedAppId } from "plugin-sdk/contexts/desinger";
import { packagesState } from "../recoil";

export function usePackages(){
  const appId = useSelectedAppId();

  return useRecoilValue(packagesState(appId));
}