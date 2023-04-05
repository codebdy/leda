import { useCallback, useEffect } from "react";
import { Graph, Node } from "@antv/x6";
import { selectedUmlDiagramState, selectedElementState, x6NodesState } from "../recoil/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useBackupSnapshot } from "../hooks/useBackupSnapshot";
import { ID } from "shared";

export function useNodeChange(graph: Graph | undefined, appId: ID) {
  const selectedDiagram = useRecoilValue(selectedUmlDiagramState(appId));
  const setNodes = useSetRecoilState(x6NodesState(appId));
  const backupSnapshot = useBackupSnapshot(appId);
  const setSelectedElement = useSetRecoilState(selectedElementState(appId));

  const handleNodeChanged = useCallback(
    (arg: { node: Node<Node.Properties> }) => {
      const { node } = arg;
      if (!selectedDiagram || !node.id) {
        return;
      }

      backupSnapshot();
      setNodes((nodes) =>
        nodes.map((nd) =>
          nd.id === node.id && nd.diagramUuid === selectedDiagram
            ? {
                id: node.id,
                x: node.getPosition().x,
                y: node.getPosition().y,
                width: node.getSize().width,
                height: node.getSize().height,
                diagramUuid: selectedDiagram,
              }
            : nd
        )
      );
      setSelectedElement(node.id)
    },
    [backupSnapshot, selectedDiagram, setNodes, setSelectedElement]
  );

  useEffect(() => {
    graph?.on("node:moved", handleNodeChanged);
    graph?.on("node:resized", handleNodeChanged);
    return () => {
      graph?.off("node:moved", handleNodeChanged);
      graph?.off("node:resized", handleNodeChanged);
    };
  }, [graph, handleNodeChanged]);
}
