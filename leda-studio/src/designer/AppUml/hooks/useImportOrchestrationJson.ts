import { message } from "antd";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { getTheFiles } from "shared/action/hooks/useOpenFile";
import { MetaContent } from "../meta";
import { codesState, orchestrationsState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useImportOrchestrationJson(appId: string) {
  const backupSnapshot = useBackupSnapshot(appId);
  const setCodes = useSetRecoilState(codesState(appId));
  const setOrchestrations = useSetRecoilState(orchestrationsState(appId));

  const doImport = useCallback(() => {
    getTheFiles(".json").then((fileHandles) => {
      fileHandles?.[0]?.getFile().then((file: any) => {
        file.text().then((fileData: any) => {
          try {
            backupSnapshot();
            const meta: MetaContent = JSON.parse(fileData);
            setCodes(meta?.codes || []);
            setOrchestrations(meta?.orchestrations || []);
          } catch (error: any) {
            console.error(error);
            message.error("file illegal");
          }
        });
      });
    });
  }, [backupSnapshot, setOrchestrations, setCodes]);

  return doImport
}