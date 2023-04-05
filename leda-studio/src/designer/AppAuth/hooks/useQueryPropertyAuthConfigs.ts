import { gql } from "enthooks";
import { useMemo } from "react";
import { useQuery } from "enthooks/hooks/useQuery";
import { useDesignerParams } from "plugin-sdk/contexts/desinger";
import { IPropertyAuthConfig } from "model";

const authConfigGql = gql`
query ($appId:ID!){
  propertyAuthConfigs(where:{
    app:{
      id:{
        _eq:$appId
      }
    }
  },
  orderBy:{
    id:desc
  }
 ){
    nodes{
      id
      canRead
      readExpression
      canUpdate
      updateExpression
      roleId
      propertyUuid
      classUuid
    }
  }
}
`

export function useQueryPropertyAuthConfigs() {
  const appParams = useDesignerParams();

  const args = useMemo(() => {
    return {
      gql: authConfigGql,
      params: { appId: appParams.app.id },
      depEntityNames: ["PropertyAuthConfig"]
    }
  }, [appParams])

  const { data, error, loading } = useQuery<IPropertyAuthConfig>(args)

  return { propertyAuthConfigs: data?.propertyAuthConfigs?.nodes, error, loading }
}