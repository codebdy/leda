import React, { useEffect, useState } from "react";
import { memo } from "react";
import TreeNodeLabel from "common/TreeNodeLabel";
import { useParseLangMessage } from "plugin-sdk";
import { OrchestrationAction } from "./OrchestrationAction";
import { OrchestrationMeta } from "../../meta/OrchestrationMeta";

export const OrchestrationLabel = memo((
  props: {
    orchestration: OrchestrationMeta
  }
) => {
  const { orchestration } = props;
  const [name, setName] = useState(orchestration.name);
  const p = useParseLangMessage();

  useEffect(() => {
    setName(orchestration.name)
  }, [orchestration])


  return (
    <TreeNodeLabel
      action={
        <OrchestrationAction orchestration={orchestration} />
      }
    >
      <div>{p(name)}</div>
    </TreeNodeLabel>
  )
})
