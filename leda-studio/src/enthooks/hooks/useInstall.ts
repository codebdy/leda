import { gql } from "enthooks";
import { useCallback } from "react";
import { RequestOptions, useLazyRequest } from "./useLazyRequest";

export interface InstallInput {
  admin: string;
  password: string;
  withDemo: boolean;
  meta: any;
}

const installMutation = gql`
  mutation install($input: InstallInput!) {
    install(input: $input)
  }
`;

export function useInstall(options?: RequestOptions<any>): [
  (input: InstallInput) => void,
  {
    error?: Error,
    loading?: boolean,
  }
] {
  const [doInstall, { error, loading }] = useLazyRequest(options)

  const install = useCallback((input: InstallInput) => {
    doInstall(installMutation, { input })
  }, [doInstall]);

  return [install, { error, loading }];
}