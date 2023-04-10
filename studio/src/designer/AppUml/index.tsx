import React, { memo, useState } from "react";
import { EntityTree } from "./EntityTree";
import { Graph } from "@antv/x6";
import "@antv/x6-react-shape";
import "./style.less"
import { useReadMeta } from "./hooks/useReadMeta";
import { useShowError } from "designer/hooks/useShowError";
import { Spin } from "antd";
import { ModelBoard } from "common/ModelBoard";
import { minMapState, selectedElementState, selectedUmlDiagramState } from "./recoil/atoms";
import { useRecoilValue } from "recoil";
import { Toolbox } from "./Toolbox";
import { UmlToolbar } from "./UmlToolbar";
import { GraphCanvas } from "./GraphCanvas";
import { PropertyPanel } from "./PropertyPanel";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { CodeScriptEditor } from "./CodeEditor/CodeScriptEditor";
import { useIsCode } from "./hooks/useIsCode";
import { useIsOrchestration } from "./hooks/useIsOrchestration";
import { OrchestrationScriptEditor } from "./CodeEditor/OrchestrationScriptEditor";

const AppUml = memo((
  props: {
    actions?: React.ReactNode,
  }
) => {
  const [graph, setGraph] = useState<Graph>();
  const appId = useEdittingAppId();
  const { loading, error } = useReadMeta(appId);
  const minMap = useRecoilValue(minMapState(appId));
  const selectedDiagram = useRecoilValue(selectedUmlDiagramState(appId));
  const selectedElement = useRecoilValue(selectedElementState(appId));
  const isCode = useIsCode(appId);
  const iseOrches = useIsOrchestration(appId);
  useShowError(error);

  return (
    <Spin tip="Loading..." spinning={loading}>
      <ModelBoard
        listWidth={260}
        modelList={<EntityTree graph={graph}></EntityTree>}
        toolbox={selectedDiagram && <Toolbox graph={graph}></Toolbox>}
        toolbar={<UmlToolbar />}
        propertyBox={<PropertyPanel />}
      >
        {
          selectedDiagram &&
          <div
            style={{
              display: "flex",
              flex: 1,
              flexFlow: "column",
              overflow: "auto"
            }}>
            <GraphCanvas
              graph={graph}
              onSetGraph={setGraph}
            ></GraphCanvas>
            <div
              className="model-minimap"
              style={{
                display: minMap ? "block" : "none"
              }}
              id="mini-map"
            ></div>
          </div>
        }
        {
          isCode(selectedElement) &&
          <CodeScriptEditor />
        }
        {
          iseOrches(selectedElement) &&
          <OrchestrationScriptEditor />
        }
      </ModelBoard>
    </Spin>
  );
});

export default AppUml;