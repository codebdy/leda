import { gql } from "enthooks";
import { useMemo } from "react";
import { useQuery } from "enthooks/hooks/useQuery";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { IPage } from "model";

const pagesGql = gql`
query ($appId:ID!){
  pages(where:{
    app:{
      id:{
        _eq:$appId
      }
    }
  }
 ){
    nodes{
      id
      title
      device
      schemaJson     
      categoryUuid
    }
  }
}
`

export function useQueryAppPages() {
  const appId = useEdittingAppId();

  const input = useMemo(() => ({
    gql: pagesGql,
    params: { appId },
    depEntityNames: ["Page"]
  }), [appId]);

  const { data, error, loading } = useQuery<IPage>(input)

  return { pages: data?.pages?.nodes, error, loading }
}