import { message } from "antd";
import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { SYSTEM_APP_ID } from "consts";
import { getTheFiles } from "shared/action/hooks/useOpenFile";
import { MetaContent } from "../meta";
import { classesState, relationsState, diagramsState, x6NodesState, x6EdgesState, packagesState } from "../recoil/atoms";
import { useBackupSnapshot } from "./useBackupSnapshot";

export function useImportModelJson(appId: string) {
  const backupSnapshot = useBackupSnapshot(appId);
  const [classes, setClasses] = useRecoilState(classesState(appId));
  const setRelations = useSetRecoilState(relationsState(appId));
  const setDiagrams = useSetRecoilState(diagramsState(appId));
  //const setCodes = useSetRecoilState(codesState(appId));
  const setX6Nodes = useSetRecoilState(x6NodesState(appId));
  const setX6Edges = useSetRecoilState(x6EdgesState(appId));
  const [packages, setPackages] = useRecoilState(packagesState(appId))

  const doImport = useCallback(() => {
    getTheFiles(".json").then((fileHandles) => {
      fileHandles?.[0]?.getFile().then((file: any) => {
        file.text().then((fileData: any) => {
          try {
            backupSnapshot();
            const meta: MetaContent = JSON.parse(fileData);
            const getPackage = (packageUuid: string) => {
              return packages?.find(pkg => pkg.uuid === packageUuid);
            }

            const systemPackages = appId === SYSTEM_APP_ID ? [] : packages?.filter(pkg => pkg.sharable) || [];
            const systemClasses = appId === SYSTEM_APP_ID ? [] : classes?.filter(cls => getPackage(cls.packageUuid)?.sharable) || []
            setPackages([...systemPackages, ...meta?.packages || []]);
            setClasses([...systemClasses, ...meta?.classes || []]);
            setRelations(meta?.relations || []);
            //setCodes(meta?.codes || []);
            setDiagrams(meta?.diagrams || []);
            setX6Nodes(meta?.x6Nodes || []);
            setX6Edges(meta?.x6Edges || []);

          } catch (error: any) {
            console.error(error);
            message.error("file illegal");
          }
        });
      });
    });
  }, [backupSnapshot, appId, packages, classes, setPackages, setClasses, setRelations, setDiagrams, setX6Nodes, setX6Edges]);

  return doImport
}