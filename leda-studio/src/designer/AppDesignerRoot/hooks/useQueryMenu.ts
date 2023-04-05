import { gql } from "enthooks";
import { useDesignerParams } from "plugin-sdk/contexts/desinger";
import { useQueryOne } from "enthooks/hooks/useQueryOne";
import { useMemo } from "react";
import { IMenu } from "model";

const menuGql = gql`
query queryMenu($appId:ID!, $device:String!){
  oneMenu(where:{
    _and:[
      {
        app:{
          id:{
            _eq:$appId
          }
        }
      },
      {
        device:{
          _eq:$device
        }
      }
    ]
  }
 ){
    id
    device
    schemaJson
  }
}
`

export function useQueryMenu() {
  const params = useDesignerParams();

  const input = useMemo(()=>({
    gql: menuGql,
    params: { device: params.device, appId: params.app.id },
    depEntityNames: ["Menu"]
  }), [params.app.id, params.device]);
  
  const { data, error, loading } = useQueryOne<IMenu>(input)

  return { menu: data?.oneMenu, error, loading }
}