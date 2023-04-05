import React, { memo, useCallback } from "react"
import { useSetRecoilState } from "recoil";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { useBackupSnapshot } from "../hooks/useBackupSnapshot";
import { useSelectedOrcherstration } from "../hooks/useSelectedOrcherstration";
import { orchestrationsState } from "../recoil/atoms";
import { CodeInput } from "./CodeInput";

export const OrchestrationScriptEditor = memo(() => {
  const appId = useEdittingAppId();
  const orches = useSelectedOrcherstration(appId);
  const setOrchestrations = useSetRecoilState(orchestrationsState(appId))
  const backup = useBackupSnapshot(appId);
  const handleChange = useCallback((value?: string) => {
    backup();
    setOrchestrations(orchestrations => orchestrations.map(or => or.uuid === orches?.uuid ? { ...or, script: value } : or))
  }, [backup, setOrchestrations, orches])
  return (
    <CodeInput key={orches?.uuid} value={orches?.script} onChange={handleChange} />
  )
})