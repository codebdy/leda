import React, { useEffect, useState } from "react";
import { memo } from "react";
import TreeNodeLabel from "common/TreeNodeLabel";
import { useParseLangMessage } from "plugin-sdk";
import CodeAction from "./CodeAction";
import { CodeMeta } from "../../meta/CodeMeta";

const CodeLabel = memo((
  props: {
    code: CodeMeta
  }
) => {
  const { code } = props;
  const [name, setName] = useState(code.name);
  const p = useParseLangMessage();

  useEffect(() => {
    setName(code.name)
  }, [code])

  return (
    <TreeNodeLabel
      action={
          <CodeAction code={code}/> 
      }
    >
      <div>{p(name)}</div>
    </TreeNodeLabel>
  )
})

export default CodeLabel;