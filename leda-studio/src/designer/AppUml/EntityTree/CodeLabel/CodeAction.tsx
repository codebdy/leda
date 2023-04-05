import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { memo, useCallback } from "react"
import { useDeleteCode } from "../../hooks/useDeleteCode";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { CodeMeta } from "../../meta/CodeMeta";

const CodeAction = memo((
  props: {
    code: CodeMeta,
  }
) => {
  const { code } = props;
  const appId = useEdittingAppId();
  const deleteCode = useDeleteCode(appId)

  const handleDelete = useCallback(() => {
    deleteCode(code.uuid)
  }, [deleteCode, code.uuid]);

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

export default CodeAction;