import { useCallback } from "react";
import { IPostOptions, usePostOne } from "../../enthooks/hooks/usePostOne";
import { IAppConfig } from "../../model";
import { IAppConfigInput } from "../../model";
import { useDesignerParams } from "plugin-sdk/contexts/desinger";

export function useUpsertAppConfig(options?: IPostOptions<any>): [
  (config: IAppConfigInput) => void,
  { loading?: boolean; error?: Error }
] {
  const params = useDesignerParams();

  const [post, { error, loading }] = usePostOne<IAppConfigInput, IAppConfig>("AppConfig",
    {
      ...options,
      fieldsGql: " schemaJson"
    }
  )

  const upsert = useCallback((config: IAppConfigInput) => {
    const newConfig = {
      ...config,
      app: {
        sync: {
          id: params.app?.id
        }
      }
    }
    post({ ...newConfig })
  }, [params?.app, post]);

  return [upsert, { error: error, loading: loading }]
}