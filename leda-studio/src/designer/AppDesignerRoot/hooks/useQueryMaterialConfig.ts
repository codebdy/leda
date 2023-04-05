import { gql } from "enthooks";
import { useMemo } from "react";
import { useQueryOne } from "enthooks/hooks/useQueryOne";
import { Device } from "@rxdrag/appx-plugin-sdk";
import { IMaterialConfig } from "model";
import { ID } from "shared";

const materialConfigGql = gql`
query ($appId:ID!, $device:String!){
  oneMaterialConfig(where:{
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

export function useQueryMaterialConfig(appId: ID, device: Device){
  const input = useMemo(()=>({
    gql: appId && materialConfigGql,
    params: { device: device, appId },
    depEntityNames: ["MaterialConfig"]
  }), [appId, device]);
  
  const { data, error, loading } = useQueryOne<IMaterialConfig>(input)

  return { materialConfig: data?.oneMaterialConfig, error, loading }
}