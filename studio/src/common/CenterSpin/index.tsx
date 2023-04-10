import { Spin } from "antd"
import React from "react";
import { memo } from "react"
import "./style.less"

export const CenterSpin = memo((
  props: {
    loading?: boolean,
  }
) => {
  const { loading } = props;
  return (
    <div className="center-loading-spin">
      <Spin spinning={loading} size = "large" />
    </div>
  )
})