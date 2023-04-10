import { useCallback } from "react";
import { IPostOptions, usePostOne } from "../../enthooks/hooks/usePostOne";
import { IPage } from "../../model";
import { IPageInput } from "../../model";

export function useUpdatePage(options?: IPostOptions<any>): [
  (page: IPageInput) => void,
  { loading?: boolean; error?: Error }
] {
  const [post, { error, loading }] = usePostOne<IPageInput, IPage>("Page",
    {
      ...options,
      fieldsGql: "id title schemaJson"
    }
  )

  const update = useCallback((page: IPageInput) => {
    post({
      ...page,
    })
  }, [post]);

  return [update, { error: error, loading: loading }]
}