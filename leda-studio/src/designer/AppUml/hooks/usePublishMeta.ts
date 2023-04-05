import { gql } from "enthooks";
import { useCallback } from "react";
import { RequestOptions, useLazyRequest } from "enthooks/hooks/useLazyRequest";
import { ID } from "shared";

const publishGql = gql`
  mutation publish($appId:ID!) {
    publish (appId:$appId)
  }
`;

export function usePublishMeta(
  appId: ID,
  options?: RequestOptions<boolean>
): [
    () => void,
    { loading: boolean | undefined; error: Error | undefined }
  ] {

  const [doPublish, { loading, error }] = useLazyRequest(options)

  const publish = useCallback(() => {
    doPublish(publishGql, { appId })
  }, [appId, doPublish]);

  return [publish, { loading, error }];
}
