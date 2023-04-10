import React, { useCallback } from "react"
import { memo } from "react"
import TreeNodeLabel from "common/TreeNodeLabel"
import { PRIMARY_COLOR } from "consts";
import { useRecoilValue } from 'recoil';
import { selectedElementState } from '../recoil/atoms';
import { Button } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { MethodMeta } from "../meta/MethodMeta";
import { useDeleteMethod } from "../hooks/useDeleteMethod";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";

const MethodLabel = memo((
  props: {
    method: MethodMeta
  }
) => {
  const { method } = props;
  const appId = useEdittingAppId();
  const selectedElement = useRecoilValue(selectedElementState(appId));
  const removeMethod = useDeleteMethod(appId);

  const handleDelete = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    removeMethod(method.uuid);
  }, [method.uuid, removeMethod]);

  return (
    <TreeNodeLabel
      action={
        <Button
          type="text"
          shape='circle'
          size='small'
          onClick={handleDelete}
        >
          <DeleteOutlined />
        </Button>
      }
    >
      <div style={{ color: selectedElement === method.uuid ? PRIMARY_COLOR : undefined }}>
        {method.name}
      </div>
    </TreeNodeLabel>
  )
})

export default MethodLabel