import { useCallback } from "react";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { IPostOptions, usePostOne } from "enthooks/hooks/usePostOne";
import { IComponentAuthConfig, IComponentAuthConfigIput } from "model";

export function useUpsertComponentAuthConfig(options?: IPostOptions<any>): [
  (config: IComponentAuthConfigIput) => void,
  { loading?: boolean; error?: Error }
] {
  const appId = useEdittingAppId()
  const [post, { error, loading }] = usePostOne<IComponentAuthConfigIput, IComponentAuthConfig>("ComponentAuthConfig",
    options
  )

  const upsert = useCallback((config: IComponentAuthConfigIput) => {
    post({ ...config, app: { sync: { id: appId } } })
  }, [post, appId]);


  return [upsert, { error, loading }]
}