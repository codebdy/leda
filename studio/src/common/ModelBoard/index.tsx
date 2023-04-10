import React from "react"
import { memo } from "react"
import { ResizableColumn } from "../ResizableColumn"
import { ModelContent } from "./ModelContent"
import "./style.less"

export const ModelBoard = memo((
  props: {
    listWidth?: number,
    modelList?: React.ReactNode,
    toolbox?: React.ReactNode,
    toolbar?: React.ReactNode,
    children?: React.ReactNode,
    propertyBox?: React.ReactNode,
  }
) => {
  const { listWidth, modelList, toolbox, toolbar, children, propertyBox } = props;
  return (
    <div className="appx-model-board">
      {
        modelList && <ResizableColumn minWidth={50} maxWidth={500} width={listWidth}>
          <div className="model-tree-shell">
            {modelList}
          </div>
        </ResizableColumn>
      }

      <ModelContent toolbox={toolbox} toolbar={toolbar} propertyBox={propertyBox}>
        {children}
      </ModelContent>
    </div>
  )
})