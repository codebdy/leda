import { gql } from "../../enthooks";
import { useMemo } from "react";
import { useQuery } from "../../enthooks/hooks/useQuery";
import { IUiFrame } from "../../model";

const templatesGql = gql`
query{
  templates{
    nodes{
      id 
      title 
      device 
      imageUrl
    }
    total
  }
}
`

export function useQueryAllTemplates() {
  const args = useMemo(() => {
    return {
      gql: templatesGql,
      depEntityNames: ["Template"],
    }
  }, [])
  return useQuery<IUiFrame>(args)
}