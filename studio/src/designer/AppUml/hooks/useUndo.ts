import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ID } from "shared";
import { EVENT_UNDO_REDO, triggerCanvasEvent } from "../GraphCanvas/events";
import {
  changedState,
  diagramsState,
  classesState,
  redoListState,
  relationsState,
  selectedUmlDiagramState,
  selectedElementState,
  undoListState,
  x6EdgesState,
  x6NodesState,
  packagesState,
  codesState,
  orchestrationsState,
} from "../recoil/atoms";

export function useUndo(appId: ID) {
  const [undoList, setUndoList] = useRecoilState(undoListState(appId));
  const setRedoList = useSetRecoilState(redoListState(appId));
  const [packages, setPackages] = useRecoilState(packagesState(appId))
  const [diagrams, setDiagrams] = useRecoilState(diagramsState(appId));
  const [codes, setCodes] = useRecoilState(codesState(appId));
  const [orchestrations, setOrchestrations] = useRecoilState(orchestrationsState(appId))
  const [entities, setEntities] = useRecoilState(classesState(appId));
  const [relations, setRelations] = useRecoilState(relationsState(appId));
  const [x6Nodes, setX6Nodes] = useRecoilState(x6NodesState(appId));
  const [x6Edges, setX6Edges] = useRecoilState(x6EdgesState(appId));
  const setChanged = useSetRecoilState(changedState(appId));

  const [selectedDiagram, setSelectedDiagram] =
    useRecoilState(selectedUmlDiagramState(appId));

  const [selectedElement, setSelectedElement] =
    useRecoilState(selectedElementState(appId));

  const undo = useCallback(() => {
    const snapshot = undoList[undoList.length - 1];
    setChanged(true);
    setRedoList((snapshots) => [
      ...snapshots,
      {
        packages,
        diagrams,
        codes,
        orchestrations,
        classes: entities,
        relations,
        x6Nodes,
        x6Edges,
        selectedDiagram,
        selectedElement,
      },
    ]);
    setUndoList((snapshots) => snapshots.slice(0, snapshots.length - 1));
    setPackages(snapshot.packages);
    setDiagrams(snapshot.diagrams);
    setCodes(snapshot.codes);
    setOrchestrations(snapshot.orchestrations);
    setEntities(snapshot.classes);
    setRelations(snapshot.relations);
    setX6Nodes(snapshot.x6Nodes);
    setX6Edges(snapshot.x6Edges);
    setSelectedDiagram(snapshot.selectedDiagram);
    setSelectedElement(snapshot.selectedElement);
    triggerCanvasEvent({
      name: EVENT_UNDO_REDO,
    });
  }, [
    undoList,
    setChanged,
    setRedoList,
    setUndoList,
    setPackages,
    setDiagrams,
    setCodes,
    setOrchestrations,
    setEntities,
    setRelations,
    setX6Nodes,
    setX6Edges,
    setSelectedDiagram,
    setSelectedElement,
    packages,
    diagrams,
    codes,
    orchestrations,
    entities,
    relations,
    x6Nodes,
    x6Edges,
    selectedDiagram,
    selectedElement,
  ]);
  return undo;
}
