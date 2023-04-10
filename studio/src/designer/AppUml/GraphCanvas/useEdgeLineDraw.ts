import React, { useCallback, useEffect } from "react";
import { LineAction } from "../recoil/LineAction";
import { Edge, Graph, Node } from "@antv/x6";
import { getRelationGraphAttrs } from "./getRelationGraphAttrs";
import { RelationMultiplicity, RelationType } from "../meta/RelationMeta";
import {
  drawingLineState,
  pressedLineTypeState,
  relationsState,
  selectedUmlDiagramState,
  selectedElementState,
  x6EdgesState,
} from "../recoil/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useGetClass } from "../hooks/useGetClass";
import { useBackupSnapshot } from "../hooks/useBackupSnapshot";
import { useCreateRelationInnerId } from "../hooks/useCreateRelationInnerId";
import { canStartLink } from "./canStartLink";
import { EVENT_PREPARE_LINK_TO, triggerCanvasEvent } from "./events";
import { useCheckCanLinkTo } from "./useCheckCanLinkTo";
import { createUuid, ID } from "shared";
import _ from "lodash";

export function useEdgeLineDraw(graph: Graph | undefined, appId: ID) {
  const [drawingLine, setDrawingLine] = useRecoilState(
    drawingLineState(appId)
  );
  const selectedDiagram = useRecoilValue(selectedUmlDiagramState(appId));
  const setRelations = useSetRecoilState(relationsState(appId));
  const selectedElement = useSetRecoilState(selectedElementState(appId));
  const setEdges = useSetRecoilState(x6EdgesState(appId));
  const getClass = useGetClass(appId);
  const backupSnapshot = useBackupSnapshot(appId);
  const [pressedLineType, setPressedLineType] = useRecoilState(
    pressedLineTypeState(appId)
  );

  const createRelationInnerId = useCreateRelationInnerId(appId);
  const canLinkTo = useCheckCanLinkTo(appId);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const p = graph?.clientToLocal({ x: clientX, y: clientY });
      const tempEdge = graph?.getCellById(drawingLine?.tempEdgeId || "") as
        | Edge
        | undefined;
      if (tempEdge) {
        tempEdge.setTarget(p as any);
      }
      if (p) {
        const [targetNode] = graph?.getNodesFromPoint(p?.x, p?.y) || [];
        if (targetNode && canLinkTo(targetNode)) {
          triggerCanvasEvent({
            name: EVENT_PREPARE_LINK_TO,
            detail: targetNode.id,
          });
        } else {
          triggerCanvasEvent({
            name: EVENT_PREPARE_LINK_TO,
            detail: undefined,
          });
        }
      }
    },
    [canLinkTo, drawingLine?.tempEdgeId, graph]
  );

  const addVertex = useCallback(
    (p: { x: number; y: number }) => {
      const tempEdge = graph?.getCellById(drawingLine?.tempEdgeId || "") as
        | Edge
        | undefined;
      if (tempEdge) {
        tempEdge?.appendVertex(p);
      }
    },
    [drawingLine?.tempEdgeId, graph]
  );

  const handleEdgeMouseUp = useCallback(
    (arg: { x: number; y: number; edge: Edge }) => {
      const { edge, x, y } = arg;
      const [targetNode] = graph?.getNodesFromPoint(x, y) || [];

      if (!selectedDiagram) {
        return;
      }

      if (drawingLine && targetNode && drawingLine?.tempEdgeId) {
        const relationId = createUuid();
        const source = getClass(drawingLine.sourceNodeId);
        const target = getClass(targetNode.id);
        const isInherit = drawingLine.relationType === RelationType.INHERIT;
        const isOneWay =
          drawingLine.relationType === RelationType.ONE_WAY_AGGREGATION ||
          drawingLine.relationType === RelationType.ONE_WAY_ASSOCIATION ||
          drawingLine.relationType === RelationType.ONE_WAY_COMBINATION;

        if (!source || !target) {
          return;
        }

        if (!canLinkTo(targetNode)) {
          return;
        }

        backupSnapshot();
        setRelations((relations) => [
          ...relations,
          {
            uuid: relationId,
            innerId:
              drawingLine.relationType !== RelationType.INHERIT
                ? createRelationInnerId()
                : 0,
            relationType: drawingLine.relationType,
            sourceId: source.uuid,
            targetId: target.uuid,
            roleOfTarget: isInherit
              ? undefined
              : target.name.toLowerCase() + _.uniqueId(),
            roleOfSource:
              isInherit || isOneWay
                ? undefined
                : source.name.toLowerCase() + _.uniqueId(),
            sourceMutiplicity: RelationMultiplicity.ZERO_ONE,
            targetMultiplicity: RelationMultiplicity.ZERO_ONE,
          },
        ]);

        const tempEdge = graph?.getCellById(drawingLine?.tempEdgeId || "") as
          | Edge
          | undefined;
        setEdges((edges) => [
          ...edges,
          {
            id: relationId,
            vertices: tempEdge?.getVertices(),
            diagramUuid: selectedDiagram,
            sourceAnchor: undefined,
            targetAnchor: undefined,
          },
        ]);
        tempEdge?.remove();
        setPressedLineType(undefined);
        setDrawingLine(undefined);
        selectedElement(relationId);
        return;
      }
      if (edge?.id === drawingLine?.tempEdgeId) {
        addVertex({ x, y });
      }
    },
    [addVertex, backupSnapshot, canLinkTo, createRelationInnerId, drawingLine, getClass, graph, selectedDiagram, selectedElement, setDrawingLine, setEdges, setPressedLineType, setRelations]
  );

  const handleEdgeDbclick = useCallback(
    (arg: { edge: Edge }) => {
      if (arg.edge?.id === drawingLine?.tempEdgeId) {
        setPressedLineType(undefined);
        setDrawingLine(undefined);
        arg.edge.remove();
      }
    },
    [drawingLine?.tempEdgeId, setDrawingLine, setPressedLineType]
  );

  //创建临时线条
  const handleNodeClick = useCallback(
    (arg: { e: React.MouseEvent; node: Node<Node.Properties> }) => {
      const { e, node } = arg;
      if (!pressedLineType) {
        return;
      }

      if (!canStartLink(pressedLineType, node.data)) {
        return;
      }

      const p = graph?.clientToLocal({ x: e.clientX, y: e.clientY });
      const lineAction: LineAction = {
        sourceNodeId: node.id,
        relationType: pressedLineType,
        tempEdgeId: graph?.addEdge({
          source: node.id,
          target: p,
          connector: { name: "rounded" },
          attrs: getRelationGraphAttrs(pressedLineType),
        }).id,
      };
      setDrawingLine(lineAction);
    },
    [graph, pressedLineType, setDrawingLine]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    graph?.on("node:click", handleNodeClick);
    graph?.on("edge:mouseup", handleEdgeMouseUp);
    graph?.on("edge:dblclick", handleEdgeDbclick);
    return () => {
      graph?.off("node:click", handleNodeClick);
      graph?.off("edge:mouseup", handleEdgeMouseUp);
      graph?.off("edge:dblclick", handleEdgeDbclick);
    };
  }, [graph, handleEdgeDbclick, handleEdgeMouseUp, handleNodeClick]);
}
