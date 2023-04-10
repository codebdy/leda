import { RequestOptions, useLazyRequest } from "enthooks";
import { useCallback } from "react";
import { ID } from "shared";

const importGql = `
  mutation ($appFile:Upload, $appId:ID){
    importApp(appFile:$appFile, appId:$appId)
  }
`

export function useImportApp(options?: RequestOptions<any>): [
  (file: File, appId?: ID) => void,
  {
    error?: Error,
    loading?: boolean,
  }
] {

  const [doImport, { error, loading }] = useLazyRequest(options)

  const importApp = useCallback((appFile: File, appId?: ID) => {
    doImport(importGql, { appFile, appId })
  }, [doImport]);

  return [importApp, { error, loading }];
}
