import { AwesomeGraphQLClient, GraphQLRequestError } from "enthooks";
import { useEffect, useState } from "react";
import { HEADER_APPX_APPID, HEADER_AUTHORIZATION, TOKEN_PREFIX } from "consts";
import { useEnthooksAppId, useEndpoint, useToken } from "../context";


export function useRequest(gql: string | undefined, params?: { [key: string]: any })
  : {
    error?: Error,
    loading?: boolean,
    data?: any,
  } {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(undefined);
  const [error, setError] = useState<Error | undefined>();
  const endpoint = useEndpoint();
  const token = useToken();
  const appId = useEnthooksAppId();

  useEffect(
    () => {
      if (!gql || !endpoint) {
        return;
      }
      const graphQLClient = new AwesomeGraphQLClient({ endpoint })
      setLoading(true);
      setError(undefined);
      graphQLClient
        .request(gql, params, {
          headers: {
            [HEADER_AUTHORIZATION]: token ? `${TOKEN_PREFIX}${token}` : "",
            [HEADER_APPX_APPID]: appId,
          } as any
        })
        .then((data) => {
          setLoading(false);
          setData(data);
        })
        .catch((err: GraphQLRequestError) => {
          setLoading(false);
          setError(err);
          console.error(err);
        });
    },
    [gql, endpoint, params, token, appId]
  );

  return { loading, error, data }
}