import React, { CSSProperties, memo } from "react"
import cls from "classnames"
import "./style.less"

export interface IComponentProps {
  className?: string,
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | false,
  children?: React.ReactNode,
  style?: CSSProperties,
}

const Component = memo((props: IComponentProps) => {
  const { className, maxWidth="xl", ...other } = props
  let maxWidthClass = "";
  if (maxWidth === "xs" ||
    maxWidth === "sm" ||
    maxWidth === "md" ||
    maxWidth === "lg" ||
    maxWidth === "xl" ||
    maxWidth === "xxl") {
    maxWidthClass = "max-" + maxWidth;
  }

  return (
    <div className={cls("appx-container", className, maxWidthClass)}  {...other} />
  )
})

export default Component;