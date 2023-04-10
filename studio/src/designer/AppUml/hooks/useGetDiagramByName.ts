import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { ID } from "shared";
import { diagramsState } from "../recoil/atoms";

export function useGetDiagramByName(appId: ID) {
  const diagrams = useRecoilValue(diagramsState(appId));

  const getDiagramByName = useCallback((name: string) => {
    return diagrams.find((diagram) => diagram.name === name);
  }, [diagrams]);

  return getDiagramByName;
}
