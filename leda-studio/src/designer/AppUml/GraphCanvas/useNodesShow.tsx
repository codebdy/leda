import "@antv/x6-react-shape";
import { Graph, Node } from "@antv/x6";
import { useEffect, useRef } from "react";
import _ from "lodash";
import { useRecoilValue } from "recoil";
import {
  selectedUmlDiagramState,
} from "../recoil/atoms";
import { useDiagramNodes } from "../hooks/useDiagramNodes";
import { useGetClass } from "../hooks/useGetClass";
import { useGetDiagramNode } from "../hooks/useGetDiagramNode";
import { useGetNode } from "../hooks/useGetNode";
import { ClassNodeData } from "./ClassView/ClassNodeData";
import { ID } from "shared";
import { useGetPackage } from "../hooks/useGetPackage";
import { useSelectedDiagramPackageUuid } from "../hooks/useSelectedDiagramPackageUuid";

export function useNodesShow(graph: Graph | undefined, appId: ID) {
  const selectedDiagram = useRecoilValue(selectedUmlDiagramState(appId));

  const nodes = useDiagramNodes(selectedDiagram || "", appId);
  const getClass = useGetClass(appId);
  const getNode = useGetNode(appId);
  const getDiagramNode = useGetDiagramNode(appId);

  const getClassRef = useRef(getClass);
  getClassRef.current = getClass;

  const getPackage = useGetPackage(appId);
  
  const selectedDiagramUuid = useSelectedDiagramPackageUuid(appId);

  useEffect(() => {
    nodes?.forEach((node) => {
      const grahpNode = graph?.getCellById(node.id) as Node<Node.Properties>;
      const cls = getClass(node.id);
      if (!cls) {
        console.error("cant not find entity by node id :" + node.id);
        return;
      }

      const data: ClassNodeData = {
        ...cls,
        ...node,
        packageName: selectedDiagramUuid !== cls.packageUuid ? getPackage(cls.packageUuid)?.name : undefined,
        //selectedId: selectedElement,
        //pressedLineType: pressedLineType,
        //drawingLine: drawingLine,
        //themeMode: themeMode,
      };
      if (grahpNode) {
        //Update by diff
        if (!_.isEqual(data, grahpNode.data)) {
          grahpNode.replaceData(data);
        }
        if (
          node.x !== grahpNode.getPosition().x ||
          node.y !== grahpNode.getPosition().y ||
          node.width !== grahpNode.getSize().width ||
          node.height !== grahpNode.getSize().height
        ) {
          grahpNode.setSize(node as any);
          grahpNode.setPosition(node as any);
        }
      } else {
        graph?.addNode({
          ...node,
          shape: "class-node",
          data,
          // component: (
          //   <ClassView
          //     onAttributeSelect={handleAttributeSelect}
          //     onAttributeDelete={handleAttributeDelete}
          //     onAttributeCreate={handleAttributeCreate}
          //     onMethodSelect={handleMethodSelect}
          //     onMethodDelete={handleMothodDelete}
          //     onMethodCreate={handleMethodCreate}
          //     onDelete={handelDeleteClass}
          //     onHide={handleHideClass}
          //   />
          // ),
        });
      }
    });
    graph?.getNodes().forEach((node) => {
      //如果diagram上没有
      if (!getDiagramNode(node.id, selectedDiagram || "")) {
        graph?.removeNode(node.id);
      }
      //如果实体已被删除
      if (!getNode(node.id, selectedDiagram || "")) {
        graph?.removeNode(node.id);
      }
    });
  }, [getClass, getDiagramNode, getNode, getPackage, graph, nodes, selectedDiagram, selectedDiagramUuid]);
}
