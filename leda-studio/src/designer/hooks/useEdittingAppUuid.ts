import { useParams } from "react-router-dom";
import { SYSTEM_APP_ID } from "../../consts";

export function useEdittingAppId() {
  const { appId = SYSTEM_APP_ID } = useParams();

  return appId;
}