import Icon from "@ant-design/icons";
import React from "react";

export interface ISvgIconProps {
  children: React.ReactElement;
}

const SvgIcon: React.FC<ISvgIconProps> = (props: ISvgIconProps) => {
  return (
    <Icon
      component={
        () =>
          props.children
      }
    />
  )
}

export default SvgIcon