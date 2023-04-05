import { gql } from "../";
import { useCallback, useMemo } from "react";
import { EVENT_DATA_POSTED, trigger } from "../events";
import { useLazyRequest } from "./useLazyRequest";

export interface IMultiPostOptions<T> {
  fieldsGql?:string,
  onCompleted?: (data: T[]) => void;
  onError?: (error: Error) => void;
  noRefresh?: boolean;
}

export type MultiPostResponse<T> = [
  (data: T[]) => void,
  { loading?: boolean; error?: Error }
]

export function usePost<T, T2>(
  __type: string,
  options?: IMultiPostOptions<T2>
): MultiPostResponse<T> {
  const postName = useMemo(() => ("upsert" + __type), [__type]);

  const [doPost, { error, loading }] = useLazyRequest({
    onCompleted: (data) => {
      trigger(EVENT_DATA_POSTED, { entity: __type })
      options?.onCompleted && data && options?.onCompleted(data[postName]);
    },
    onError: options?.onError
  })

  const post = useCallback(
    (objects: T[]) => {
      const inputType = __type + "Input";
      const postMutation = gql`
        mutation ($objects: [${inputType}!]!) {
          ${postName}(objects: $objects){
            id
            ${options?.fieldsGql || ""}              
          }
        }
      `;
      doPost(postMutation, { objects });
    },
    [__type, doPost, options?.fieldsGql, postName]
  );

  return [post, { loading, error }];
}
