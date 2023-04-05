import { ID } from "shared";
import { useRecoilValue } from 'recoil';
import { diagramsState } from "../recoil/atoms";
import { selectedUmlDiagramState } from '../recoil/atoms';

export function useSelectedDiagramPackageUuid(appId: ID) {
  const diagrams = useRecoilValue(diagramsState(appId));
  const selectedDiagramId = useRecoilValue(selectedUmlDiagramState(appId));
  return diagrams.find(diagram => diagram.uuid === selectedDiagramId)?.packageUuid;
}