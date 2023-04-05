import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ID } from "shared";
import { EVENT_CLASS_CHANGED, triggerCanvasEvent } from "../GraphCanvas/events";
import { ClassMeta } from "../meta/ClassMeta";
import { classesState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useChangeClass(appId: ID) {
  const backupSnapshot = useBackupSnapshot(appId);
  const setClasses = useSetRecoilState(classesState(appId));
  const classes = useRecoilValue(classesState(appId));
  const { t } = useTranslation();

  const changeClass = useCallback(
    (cls: ClassMeta) => {
      if (
        classes
          .filter((cl) => cl.uuid !== cls.uuid)
          .find((cl) => cl.name === cls.name)
      ) {
        return t("ErrorNameRepeat");
      }
      backupSnapshot();
      setClasses((entities) =>
        entities.map((ent) => (ent.uuid === cls.uuid ? cls : ent))
      );
      triggerCanvasEvent({ name: EVENT_CLASS_CHANGED, detail: cls });
      return undefined;
    },
    [backupSnapshot, classes, setClasses, t]
  );

  return changeClass;
}
