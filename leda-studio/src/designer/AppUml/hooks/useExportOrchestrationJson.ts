import { message } from "antd";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MetaContent } from "../meta";
import { saveFile } from "./helper/saveFile";
import { useGetMeta } from "./useGetMeta";

export function useExportOrchestrationJson(appId: string) {
  const { t } = useTranslation();
  const getMeta = useGetMeta(appId)
  const doExport = useCallback(() => {

    const data: MetaContent = getMeta();
    saveFile(appId + '-orchestration', JSON.stringify({
      codes: data.codes,
      orchestrations: data.orchestrations,
    }, null, 2)).then(
      (savedName) => {
        if (savedName) {
          message.success(t("OperateSuccess"))
        }
      }
    );
  }, [appId, getMeta, t]);

  return doExport
}