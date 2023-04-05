import { gql } from "enthooks";
import { useMemo } from "react";
import { useQuery } from "enthooks/hooks/useQuery";
import { ISnapshot } from "model";
import { ID } from "shared";

const versionsGql = gql`
query ($appId:ID!, $instanceId:ID!){
  snapshots(where:{
    _and:[
      {
        app:{
          id:{
            _eq:$appId
          }
        }
      },
      {
        instanceId:{
          _eq:$instanceId
        }
      }
    ]
  },
  orderBy:{
    id:desc
  }
 ){
    nodes{
      id
      instanceId
      version
      description
      createdAt
    }
  }
}
`

export function useQueryVersions(appId?: ID, instanceId?: ID) {

  const args = useMemo(() => {
    return {
      gql: appId && instanceId ? versionsGql : undefined,
      params: { instanceId: instanceId, appId: appId },
      depEntityNames: ["Snapshot"]
    }
  }, [appId, instanceId])

  const { data, error, loading } = useQuery<ISnapshot>(args as any)

  return { snapshots: data?.snapshots?.nodes, error, loading }
}