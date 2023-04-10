import { useCallback } from "react";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { IPostOptions, usePostOne } from "enthooks/hooks/usePostOne";
import { IClassAuthConfig, IClassAuthConfigInput } from "model";

export function useUpsertClassAuthConfig(options?: IPostOptions<any>): [
  (config: IClassAuthConfigInput) => void,
  { loading?: boolean; error?: Error }
] {
  const appId = useEdittingAppId()
  const [post, { error, loading }] = usePostOne<IClassAuthConfigInput, IClassAuthConfig>("ClassAuthConfig",
    options
  )

  const upsert = useCallback((config: IClassAuthConfigInput) => {
    post({ ...config, app: { sync: { id: appId } } })
  }, [post, appId]);


  return [upsert, { error, loading }]
}