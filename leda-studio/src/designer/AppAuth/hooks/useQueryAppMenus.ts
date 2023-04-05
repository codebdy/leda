import { gql } from "enthooks";
import { useMemo } from "react";
import { useQuery } from "enthooks/hooks/useQuery";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { IMenu } from "model";

const menuGql = gql`
query ($appId:ID!){
  menus(where:{
    app:{
      id:{
        _eq:$appId
      }
    }
  }
 ){
    nodes{
      id
      device
      schemaJson      
    }
  }
}
`

export function useQueryAppMenus() {
  const appId = useEdittingAppId();

  const input = useMemo(() => ({
    gql: menuGql,
    params: { appId },
    depEntityNames: ["Menu"]
  }), [appId]);

  const { data, error, loading } = useQuery<IMenu>(input)

  return { menus: data?.menus?.nodes, error, loading }
}