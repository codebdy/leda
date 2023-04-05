import { gql } from "enthooks";
import { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { useQuery } from "enthooks/hooks/useQuery";
import { IRole } from "model";
import { authRolesState } from "../recoil/atoms";

const rolesGql = gql`
query {
  roles{
    nodes{
      id
      name
    }
  }
}
`

export function useQueryRoles() {
  const args = useMemo(() => {
    return {
      gql: rolesGql,
      depEntityNames: ["Role"]
    }
  }, [])
  const setRoles = useSetRecoilState(authRolesState);
  const { data, error, loading } = useQuery<IRole>(args)

  useEffect(() => {
    setRoles(data?.roles?.nodes || [])
  }, [setRoles, data])
  return { error, loading }
}