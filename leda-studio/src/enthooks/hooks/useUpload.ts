import { AwesomeGraphQLClient, GraphQLRequestError } from "enthooks";
import { useCallback } from "react";
import { HEADER_APPX_APPID, HEADER_AUTHORIZATION, TOKEN_PREFIX } from "consts";
import { useEnthooksAppId, useEndpoint, useToken } from "../context";

const gql = `
  mutation ($file:Upload!){
    upload(file:$file)
  }
`

export function useUpload() {
  const endpoint = useEndpoint();
  const token = useToken();
  const appId = useEnthooksAppId();

  const upload = useCallback((file: File) => {
    const p = new Promise<string>((resolve, reject) => {
      const graphQLClient = new AwesomeGraphQLClient({ endpoint })
      graphQLClient
        .request(gql, { file }, {
          headers: {
            [HEADER_AUTHORIZATION]: token ? `${TOKEN_PREFIX}${token}` : "",
            [HEADER_APPX_APPID]: appId,
          } as any
        })
        .then((data) => {
          resolve(data?.upload);
        })
        .catch((err: GraphQLRequestError) => {
          reject(err);
        });
    })
    return p;
  }, [appId, endpoint, token])

  return upload;
}
