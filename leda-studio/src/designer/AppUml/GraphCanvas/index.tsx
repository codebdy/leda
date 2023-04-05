import { memo, useEffect } from "react";
import { useExplorerScrollbarHide } from "./useExplorerScrollbarHide";
import { useEdgeLineDraw } from "./useEdgeLineDraw";
import { useEdgeChange } from "./useEdgeChange";
import { Graph } from "@antv/x6";
import { getGraphConfig } from "./getGraphConfig";
import { useNodesShow } from "./useNodesShow";
import { useNodeAdd } from "./useNodeAdd";
import { useNodeChange } from "./useNodeChange";
import { useNodeSelect } from "./useNodeSelect";
import { useEdgesShow } from "./useEdgesShow";
import { useEdgeSelect } from "./useEdgeSelect";
import { useTriggerSelectedEvent } from "./useTriggerSelectedEvent";
import { useEdgeHover } from "./useEdgeHover";
import { useTriggerPressedLineTypeEvent } from "./useTriggerPressedLineTypeEvent";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { Selection } from '@antv/x6-plugin-selection'
import { MiniMap } from "@antv/x6-plugin-minimap";
import { Transform } from '@antv/x6-plugin-transform'
import { useClassAction } from "./useClassAction";

export const GraphCanvas = memo(
  (props: {
    graph?: Graph;
    onSetGraph: (graph?: Graph) => void,
  }) => {
    const { graph, onSetGraph } = props;
    const appId = useEdittingAppId();

    useEffect(() => {
      const config = getGraphConfig();
      const aGraph = new Graph(config);
      aGraph.use(
        new MiniMap({
          container: document.getElementById("mini-map")!,
          width: 140,
          height: 110
        })
      );
      aGraph.use(new Selection({
        enabled: true,
        multiple: false,
        rubberband: false,
        movable: true,
        //showNodeSelectionBox: true,
      }))
      aGraph.use(
        new Transform({
          resizing: true,
          rotating: false,
        }),
      )
      onSetGraph(aGraph);
      return () => {
        aGraph?.dispose();
        onSetGraph(undefined);
      };
    }, [onSetGraph]);

    useExplorerScrollbarHide();
    useTriggerSelectedEvent(appId);
    useTriggerPressedLineTypeEvent(appId);
    useNodeSelect(graph, appId);
    useEdgeSelect(graph, appId);
    useNodesShow(graph, appId);
    useEdgeLineDraw(graph, appId);
    useEdgesShow(graph, appId);
    useNodeChange(graph, appId);
    useEdgeChange(graph, appId);
    useNodeAdd(graph, appId);
    useEdgeHover(graph, appId);
    useClassAction(graph, appId);
    
    return (
      <div
        id="container"
        style={{
          flex: 1,
          overflow: "auto",
          position: "relative",
        }}
      ></div>
    );
  }
);
