import React from "react"
import { memo } from "react"
import { ResizableColumn } from "../ResizableColumn";
import "./style.less"
import cls from "classnames"

export const ListConentLayout = memo((
  props: {
    listWidth?: number,
    list?: React.ReactNode,
    children?: React.ReactNode,
    className?: string,
  }
) => {
  const { listWidth, list, children, className } = props;
  return (
    <div className={cls("appx-list-content-layout", className)}>
      <ResizableColumn minWidth={50} maxWidth={500} width={listWidth}>
        {list}
      </ResizableColumn>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexFlow: "column",
        }}
      >
        {children}
      </div>
    </div>
  )
})