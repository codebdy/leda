import { useSetToken } from "../context";
import { gql } from 'enthooks'
import { useLazyRequest } from "./useLazyRequest";
import { useCallback } from "react";

const logoutMutation = gql`
  mutation {
    logout
  }
`;

export function useLogout(): [
  () => void,
  { loading?: boolean; error?: Error }
] {

  const setConfigToken = useSetToken();

  const [doLogout, { loading, error }] = useLazyRequest({
    onCompleted: (data: any) => {
      setConfigToken(undefined);
    },
  })

  const logout = useCallback(()=>{
    doLogout(logoutMutation)
  }, [doLogout])

  return [logout, { loading, error }];
}
