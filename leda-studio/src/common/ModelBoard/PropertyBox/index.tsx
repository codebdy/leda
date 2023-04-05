import { Empty } from "antd";
import React, { memo } from "react";
import ToolbarArea from "./ToolbarArea";
import ToolbarTitle from "./ToolbarTitle";

export const PropertyBox = memo((
  props: {
    title?: string,
    children?: React.ReactNode,
  }
) => {
  const { title, children } = props;
  return (
    <div
      className="property-box left-border"
    >
      <ToolbarArea>
        <ToolbarTitle>{title}</ToolbarTitle>
      </ToolbarArea>
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {
          children || <div style={{ padding: "16px" }}>
            <Empty />
          </div>
        }
      </div>
    </div>
  );
});
