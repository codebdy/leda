import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { useMountRef } from "./useMountRef";
import {
  EVENT_ELEMENT_SELECTED_CHANGE,
  offCanvasEvent,
  onCanvasEvent,
} from "../events";
import { MethodMeta } from "../../meta/MethodMeta";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function MethodView(props: {
  method: MethodMeta;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { method, onClick, onDelete } = props;
  const [hover, setHover] = useState(false);
  const [isSelected, setIsSelected] = React.useState(false);
  const mountRef = useMountRef();

  const handleClick = () => {
    onClick(method.uuid);
  };

  const handleDeleteClick = () => {
    onDelete(method.uuid);
  };

  const handleChangeSelected = useCallback(
    (event: Event) => {
      const selectedId = (event as CustomEvent).detail;
      if (mountRef.current) {
        setIsSelected(selectedId === method.uuid);
      }
    },
    [method.uuid, mountRef]
  );

  useEffect(() => {
    onCanvasEvent(EVENT_ELEMENT_SELECTED_CHANGE, handleChangeSelected);
    return () => {
      offCanvasEvent(EVENT_ELEMENT_SELECTED_CHANGE, handleChangeSelected);
    };
  }, [handleChangeSelected]);

  return (
    <div
      className={classNames('property', {
        'hover': hover,
        'selected': isSelected,
      })}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginLeft: "3px",
          }}
        >
          {method.name}(
          {method.args.map((arg) => arg.name + ":" + arg.typeLabel).join(",")}
          {
            // method.args.length > 0
            //   ? "..."
            //   : ""
          }
          )
        </div>
        :
        <div
          style={{
            fontSize: "0.8rem",
            marginLeft: "5px",
          }}
        >
          {method.typeLabel}
        </div>
      </div>
      {hover && (
        <div className="property-action">
          <Button
            type="text"
            shape="circle"
            size="small"
            onClick={handleDeleteClick}
          >
            <DeleteOutlined size={10} />
          </Button>
        </div>
      )}
    </div>
  );
}
