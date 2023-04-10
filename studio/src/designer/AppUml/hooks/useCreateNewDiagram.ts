import { useGetDiagramByName } from "./useGetDiagramByName";
import { useCallback } from "react";
import { createUuid, ID } from "shared";
import { useTranslation } from "react-i18next";

export function useCreateNewDiagram(appId: ID) {
  const getDiagramByName = useGetDiagramByName(appId);
  const { t } = useTranslation();

  const getNewDiagramName = useCallback(() => {
    const prefix = t("AppUml.NewDiagram");
    let index = 1;
    while (getDiagramByName(prefix + index)) {
      index++;
    }

    return prefix + index;
  }, [getDiagramByName, t]);

  const createNewDiagram = useCallback((packageUuid: string) => {
    const newDiagram = {
      uuid: createUuid(),
      name: getNewDiagramName(),
      packageUuid,
      nodes: [],
      edges: [],
    };
    return newDiagram;
  }, [getNewDiagramName]);

  return createNewDiagram;
}
