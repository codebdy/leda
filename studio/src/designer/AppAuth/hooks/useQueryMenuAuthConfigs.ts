import { gql } from "enthooks";
import { useMemo } from "react";
import { useQuery } from "enthooks/hooks/useQuery";
import { useDesignerParams } from "plugin-sdk/contexts/desinger";
import { IMenuAuthConfig } from "model";

const authConfigGql = gql`
query ($appId:ID!){
  menuAuthConfigs(where:{
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
      menuItemUuid
    }
  }
}
`

export function useQueryMenuAuthConfigs() {
  const appParams = useDesignerParams();

  const args = useMemo(() => {
    return {
      gql: authConfigGql,
      params: { appId: appParams.app.id },
      depEntityNames: ["MenuAuthConfig"]
    }
  }, [appParams])

  const { data, error, loading } = useQuery<IMenuAuthConfig>(args)

  return { menuConfigs: data?.menuAuthConfigs?.nodes, error, loading }
}