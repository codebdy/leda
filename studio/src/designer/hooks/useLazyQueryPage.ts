import { gql, QueryOneResult } from "../../enthooks";
import { useCallback } from "react";
import { RequestOptions, useLazyRequest } from "../../enthooks/hooks/useLazyRequest";
import { IPage } from "../../model";
import { ID } from "shared";

const pageGql = gql`
query queryPage($id:ID!){
  onePage(where:{
    id:{
      _eq:$id
    }
  }){
    id
    title
    schemaJson
    categoryUuid
  }
}
`

export function useLazyQueryPage(options?: RequestOptions<IPage>): [
  (id: ID) => void,
  {
    page?: IPage,
    loading?: boolean,
    error?: Error,
  }
] {
  const [doQuery, { data, error, loading }] = useLazyRequest<QueryOneResult<IPage>>({
    onCompleted: (data) => {
      options?.onCompleted && options?.onCompleted(data?.onePage)
    },
    onError: options?.onError
  })

  const query = useCallback((id: ID) => {
    doQuery(pageGql, { id })
  }, [doQuery])

  return [query, { page: data?.onePage, error, loading }]
}