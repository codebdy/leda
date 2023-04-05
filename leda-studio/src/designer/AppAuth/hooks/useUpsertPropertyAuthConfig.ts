import { useCallback } from "react";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { IPostOptions, usePostOne } from "enthooks/hooks/usePostOne";
import { IPropertyAuthConfig, IPropertyAuthConfigInput } from "model";

export function useUpsertPropertyAuthConfig(options?: IPostOptions<any>): [
  (config: IPropertyAuthConfigInput) => void,
  { loading?: boolean; error?: Error }
] {
  const appId = useEdittingAppId()
  const [post, { error, loading }] = usePostOne<IPropertyAuthConfigInput, IPropertyAuthConfig>("PropertyAuthConfig",
    options
  )

  const upsert = useCallback((config: IPropertyAuthConfigInput) => {
    post({ ...config, app: { sync: { id: appId } } })
  }, [post, appId]);


  return [upsert, { error, loading }]
}