import { gql } from "enthooks";
import { useCallback, useMemo } from "react";
import { ID } from "shared";
import { EVENT_DATA_REMOVED, trigger } from "../events";
import { useLazyRequest } from "./useLazyRequest";

export interface IDeleteOptions<T> {
  onCompleted?: (data: T) => void;
  onError?: (error: Error) => void;
  noRefresh?: boolean;
}

export type DeleteResponse = [
  (id: ID) => void,
  { loading?: boolean; error?: Error }
]

export function useDeleteById<T>(__type: string, options?:IDeleteOptions<T>): DeleteResponse {
  const methodName = useMemo(() => (`delete${__type}ById`), [__type]);

  const [doRemove, { error, loading }] = useLazyRequest({
    onCompleted: (data) => {
      const deletedObj = data[methodName];
      trigger(EVENT_DATA_REMOVED, { entity: __type, ids:[deletedObj?.id] })
      options?.onCompleted && data && options?.onCompleted(deletedObj);
    },
    onError: options?.onError
  })

  const remove = useCallback(
    (id: ID) => {
      const deleteGql = gql`
        mutation ${methodName} ($id: ID!) {
          ${methodName}(id: $id){
            id
          }
        }
      `;
      doRemove(deleteGql, { id });
    },
    [doRemove, methodName]
  );

  return [remove, {error, loading}]
}