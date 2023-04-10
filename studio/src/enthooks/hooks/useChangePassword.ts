import { gql } from 'enthooks'
import { useCallback } from 'react';
import { RequestOptions, useLazyRequest } from './useLazyRequest';

const changePasswordGql = gql`
  mutation changePassword($loginName: String!, $oldPassword: String!, $newPassword: String!) {
    changePassword(loginName: $loginName, oldPassword: $oldPassword,  newPassword: $newPassword)
  }
`;


export interface ChangeInput {
  loginName: string;
  oldPassword: string;
  newPassword: string;
}

export function useChangePassword(
  options?: RequestOptions<string>
): [
    (input: ChangeInput) => void,
    { token?: string; loading?: boolean; error?: Error }
  ] {
  const [doChange, { data, error, loading }] = useLazyRequest<{ changePassword: string }>({
    onCompleted: (data: any) => {
      options?.onCompleted && options?.onCompleted(data?.changePassword);
    },
    onError: (error) => {
      options?.onError && options?.onError(error);
    }
  })

  const change = useCallback((input: ChangeInput) => {
    doChange(changePasswordGql, input)
  }, [doChange])
  return [change, { token: data?.changePassword, loading, error }];
}
