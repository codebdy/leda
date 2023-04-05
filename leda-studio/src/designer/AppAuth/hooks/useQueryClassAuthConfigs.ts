import { gql } from "enthooks";
import { useMemo } from "react";
import { useQuery } from "enthooks/hooks/useQuery";
import { useDesignerParams } from "plugin-sdk/contexts/desinger";
import { IClassAuthConfig } from "model";

const authConfigGql = gql`
query ($appId:ID!){
  classAuthConfigs(where:{
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
      expanded
      canRead
      readExpression
      canUpdate
      updateExpression
      canDelete
      deleteExpression
      canCreate
      createExpression
      roleId
      classUuid
    }
  }
}
`

export function useQueryClassAuthConfigs() {
  const appParams = useDesignerParams();

  const args = useMemo(() => {
    return {
      gql: authConfigGql,
      params: { appId: appParams.app.id },
      depEntityNames: ["ClassAuthConfig"]
    }
  }, [appParams])

  const { data, error, loading } = useQuery<IClassAuthConfig>(args)

  return { classAuthConfigs: data?.classAuthConfigs?.nodes, error, loading }
}