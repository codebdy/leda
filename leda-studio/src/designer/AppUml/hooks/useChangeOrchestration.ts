import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { ID } from "shared";
import { OrchestrationMeta } from "../meta/OrchestrationMeta";
import { orchestrationsState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";
import { useCheckOrchestrationName } from "./useCheckOrchestrationName";

export function useChangeOrchestration(appId: ID) {
  const setOrchestration = useSetRecoilState(orchestrationsState(appId));
  const chackName = useCheckOrchestrationName(appId);
  const backupSnapshot = useBackupSnapshot(appId);
  const { t } = useTranslation();
  const changeOrchestration = useCallback(
    (orche: OrchestrationMeta) => {
      if (!chackName(orche.name, orche.uuid)) {
        return t("ErrorNameRepeat");
      }
      backupSnapshot();
      setOrchestration(ors => ors.map(or => or.uuid === orche.uuid ? orche : or));
    },
    [backupSnapshot, chackName, setOrchestration, t]
  );

  return changeOrchestration;
}