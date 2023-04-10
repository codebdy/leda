import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { memo, useCallback } from "react"
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { OrchestrationMeta } from "../../meta/OrchestrationMeta";
import { useDeleteOrchestration } from "../../hooks/useDeleteOrchestration";

export const OrchestrationAction = memo((
  props: {
    orchestration: OrchestrationMeta,
  }
) => {
  const { orchestration } = props;
  const appId = useEdittingAppId();
  const deleteOrches = useDeleteOrchestration(appId)

  const handleDelete = useCallback(() => {
    deleteOrches(orchestration.uuid)
  }, [deleteOrches, orchestration.uuid]);

  return (
    <Button
      type="text"
      shape='circle'
      size='small'
      onClick={handleDelete}
      style={{ color: "inherit" }}
    >
      <DeleteOutlined />
    </Button>
  )
})
