import { gql } from "../../enthooks";
import { useMemo } from "react";
import { SYSTEM_APP_ID } from "../../consts";
import { useQuery } from "../../enthooks/hooks/useQuery";
import { ILangLocal } from "../../model";

const langLocalGql = gql`
query ($appId:ID!){
  langLocals(where:{
    app:{
      id:{
        _eq:$appId
      }
    }
  }){
    nodes{
      id
      name
      schemaJson      
    }
  }
}
`

export function useQueryLangLocales(appId: string) {
  const input = useMemo(() => ({
    gql: langLocalGql,
    params: { appId: appId || SYSTEM_APP_ID },
    depEntityNames: ["LangLocal"]
  }), [appId])
  const { data, error, loading } = useQuery<ILangLocal>(input)
  return { langLocales: data?.langLocals?.nodes, error, loading }
}