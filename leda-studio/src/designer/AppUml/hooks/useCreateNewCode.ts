import { useCallback } from "react";
import { createUuid, ID } from "shared";
import { useTranslation } from "react-i18next";
import { useGetCodeByName } from "./useGetCodeByName";
import { useBackupSnapshot } from "./useBackupSnapshot";
import { codesState, selectedElementState, selectedUmlDiagramState } from "../recoil/atoms";
import { useSetRecoilState } from "recoil";

export function useCreateNewCode(appId: ID) {
  const getCodeByName = useGetCodeByName(appId);
  const backup = useBackupSnapshot(appId);
  const setCodes = useSetRecoilState(codesState(appId));
  const setSelectedElement = useSetRecoilState(selectedElementState(appId));
  const setSelectedDiagram = useSetRecoilState(
    selectedUmlDiagramState(appId)
  );

  const { t } = useTranslation();

  const getNewCodeName = useCallback(() => {
    const prefix = t("AppUml.NewCode");
    let index = 1;
    while (getCodeByName(prefix + index)) {
      index++;
    }

    return prefix + index;
  }, [getCodeByName, t]);

  const createNewCode = useCallback(() => {
    backup()
    const newCode = {
      uuid: createUuid(),
      name: getNewCodeName(),
      code: ""
    };
    setCodes(codes => [...codes, newCode]);
    setSelectedElement(newCode.uuid);
    setSelectedDiagram(undefined);
  }, [backup, getNewCodeName, setCodes, setSelectedElement, setSelectedDiagram]);

  return createNewCode;
}
