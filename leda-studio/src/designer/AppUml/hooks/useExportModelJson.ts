import { message } from "antd";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MetaContent } from "../meta";
import { saveFile } from "./helper/saveFile";
import { useGetMeta } from "./useGetMeta";

export function useExportModelJson(appId: string) {
  const { t } = useTranslation();
  const getMeta = useGetMeta(appId)
  const doExport = useCallback(() => {

    const data: MetaContent = getMeta();
    delete data.codes;
    delete data.orchestrations;
    saveFile(appId + '-model', JSON.stringify(data, null, 2)).then(
      (savedName) => {
        if (savedName) {
          message.success(t("OperateSuccess"))
        }
      }
    );
  }, [appId, getMeta, t]);

  return doExport
}