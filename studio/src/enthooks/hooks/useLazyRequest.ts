import { AwesomeGraphQLClient, GraphQLRequestError } from "enthooks";
import { useCallback, useRef, useState } from "react";
import { HEADER_APPX_APPID, HEADER_AUTHORIZATION, TOKEN_PREFIX } from "consts";
import { useEnthooksAppId, useEndpoint, useToken } from "../context";
import { useMountRef } from "./useMountRef";

export interface RequestOptions<T> {
  onCompleted?: (data: T) => void;
  onError?: (error: GraphQLRequestError) => void;
}

export function useLazyRequest<T>(options?: RequestOptions<any>)
  : [
    (gql: string | undefined, params?: any) => void,
    {
      error?: GraphQLRequestError,
      loading?: boolean,
      data?: T,
    }
  ] {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(undefined);
  const [error, setError] = useState<GraphQLRequestError | undefined>();
  const endpoint = useEndpoint();
  const token = useToken();
  const mountRef = useMountRef();
  const appId = useEnthooksAppId();
  const optionsRef = useRef<RequestOptions<any>>();
  const endpointRef = useRef<string>();
  optionsRef.current = options;
  endpointRef.current = endpoint;

  const request = useCallback(
    (gql: string | undefined, params?: any) => {
      const endpoint = endpointRef.current;
      if (!gql || !endpoint) {
        console.error("gql or endpoint is null", endpoint, gql)
        return;
      }

      const options = optionsRef.current;

      const headers = {
        [HEADER_AUTHORIZATION]: token ? `${TOKEN_PREFIX}${token}` : "",
        [HEADER_APPX_APPID]: appId,
      }

      const graphQLClient = new AwesomeGraphQLClient({ endpoint })
      setLoading(true);
      setError(undefined);
      graphQLClient
        .request(gql, params, {
          headers: headers as any
        })
        .then((data: any) => {
          if (!mountRef.current) {
            return;
          }
          setLoading(false);
          options?.onCompleted && options?.onCompleted(data);
          setData(data);
        })
        .catch((err: GraphQLRequestError) => {
          setLoading(false);
          setError(err);
          console.error(err);
          options?.onError && options?.onError(err);
        });
    },
    //此处需要确认
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, token, appId, mountRef/*, options*/]
  );

  return [request, { loading, error, data }]
}