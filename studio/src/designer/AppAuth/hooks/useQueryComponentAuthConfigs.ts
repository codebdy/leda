import { gql } from "enthooks";
import { useMemo } from "react";
import { useQuery } from "enthooks/hooks/useQuery";
import { useDesignerParams } from "plugin-sdk/contexts/desinger";
import { IComponentAuthConfig } from "model";

const authConfigGql = gql`
query ($appId:ID!){
  componentAuthConfigs(where:{
    app:{
      id:{
        _eq:$appId
      }
    }
  }
 ){
    nodes{
      id
      roleId
      device
      refused
      componentId
    }
  }
}
`

export function useQueryComponentAuthConfigs() {
  const appParams = useDesignerParams();

  const args = useMemo(() => {
    return {
      gql: authConfigGql,
      params: { appId: appParams.app.id },
      depEntityNames: ["ComponentAuthConfig"]
    }
  }, [appParams])

  const { data, error, loading } = useQuery<IComponentAuthConfig>(args)

  return { componentConfigs: data?.componentAuthConfigs?.nodes, error, loading }
}