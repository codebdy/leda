import { useCallback } from "react";
import { IPostOptions, usePostOne } from "../../enthooks/hooks/usePostOne";
import { IAppDeviceConfig } from "../../model";
import { IAppDeviceConfigInput } from "../../model";
import { useDesignerParams } from "plugin-sdk/contexts/desinger";

export function useUpsertAppDeviceConfig(options?: IPostOptions<any>): [
  (config: IAppDeviceConfigInput) => void,
  { loading?: boolean; error?: Error }
] {
  const params = useDesignerParams();

  const [post, { error, loading }] = usePostOne<IAppDeviceConfigInput, IAppDeviceConfig>("AppDeviceConfig",
    {
      ...options,
      fieldsGql: " device schemaJson"
    }
  )

  const upsert = useCallback((config: IAppDeviceConfigInput) => {
    const newConfig = {
      ...config,
      app: { sync: { id: params.app.id } },
    }
    post({ ...newConfig })
  }, [params?.app, post]);

  return [upsert, { error: error, loading: loading }]
}