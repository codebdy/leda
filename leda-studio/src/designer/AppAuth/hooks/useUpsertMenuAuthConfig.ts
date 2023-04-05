import { useCallback } from "react";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { IPostOptions, usePostOne } from "enthooks/hooks/usePostOne";
import { IMenuAuthConfig, IMenuAuthConfigInput } from "model";
import { GraphQLRequestError } from "enthooks";

export function useUpsertMenuAuthConfig(options?: IPostOptions<any>): [
  (config: IMenuAuthConfigInput) => void,
  { loading?: boolean; error?: GraphQLRequestError | Error }
] {
  const appId = useEdittingAppId()
  const [post, { error, loading }] = usePostOne<IMenuAuthConfigInput, IMenuAuthConfig>("MenuAuthConfig",
    options
  )

  const upsert = useCallback((config: IMenuAuthConfigInput) => {
    post({ ...config, app: { sync: { id: appId } } })
  }, [post, appId]);


  return [upsert, { error, loading }]
}