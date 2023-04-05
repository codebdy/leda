import { gql } from "../../enthooks";
import { useMemo } from "react";
import { SYSTEM_APP_ID } from "../../consts";
import { useQueryOne } from "../../enthooks/hooks/useQueryOne";
import { IAppConfig } from "../../model";
import { ID } from "shared";

const configGql = gql`
query ($appId:ID){
  oneAppConfig(where:{
    app:{
      id:{
        _eq:$appId
      }
    }
  }){
    id
    schemaJson
  }
}
`

export function useQueryAppConfig(appId: ID) {
  const input = useMemo(() => ({
    gql: configGql,
    params: { appId: appId || SYSTEM_APP_ID },
    depEntityNames: ["AppConfig"]
  }), [appId])

  const { data, error, loading } = useQueryOne<IAppConfig>(input)
  return { config: data?.oneAppConfig, error, loading }
}