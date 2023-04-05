import React, { memo } from "react";
import "./style.less";

export const ModelToolbar = memo((
  props: {
    children?: React.ReactNode,
  }
) => {
  const { children } = props;
  return (
    <div className={"model-toolbar"}>
      <div className={"toolbarInner"}>
        {children}
      </div>
    </div >
  );
});
