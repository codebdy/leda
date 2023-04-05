import { gql } from "enthooks";
import { ID } from "shared";

import { useRequest } from "./useRequest";

export interface IUser {
  id: ID;
  name: string;
  loginName: string;
  isSupper?: boolean;
  isDemo?: boolean;
}

const queryGql = gql`
  query{
    me{
      id
      name
      loginName
      isSupper
      isDemo
    }
  }
`;

export function useQueryMe(): {
  loading?: boolean,
  error?: Error,
  me?: IUser
} {
  const { data, error, loading } = useRequest(queryGql);
  return { me: data?.me, error, loading }
}