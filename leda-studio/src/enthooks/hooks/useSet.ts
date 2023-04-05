import { gql } from "enthooks";
import { useCallback, useMemo } from "react";
import { EVENT_DATA_UPDATED, trigger } from "../events";
import { useLazyRequest } from "./useLazyRequest";

export interface ISetOptions<T> {
  fieldsGql?: string,
  onCompleted?: (data: T[]) => void;
  onError?: (error: Error) => void;
  noRefresh?: boolean;
}

export type SetResponse<T> = [
  (set: T, where: any) => void,
  { loading?: boolean; error?: Error }
]

export function useSet<T, T2>(
  __type: string,
  options?: ISetOptions<T2>
): SetResponse<T> {
  const setName = useMemo(() => ("set" + __type), [__type]);

  const [doSet, { error, loading }] = useLazyRequest({
    onCompleted: (data) => {
      trigger(EVENT_DATA_UPDATED, { entity: __type })
      options?.onCompleted && data && options?.onCompleted(data[setName]);
    },
    onError: options?.onError
  })

  const set = useCallback(
    (set: T, where: any) => {
      const setType = __type + "Set";
      const boolExp = __type + "BoolExp";
      const postMutation = gql`
        mutation ${setName} ($set: ${setType}!, $where:${boolExp}!) {
          ${setName}(set: $set, where:$where){
            returning{
              id
              ${options?.fieldsGql || ""}
            }
          }
        }
      `;
      doSet(postMutation, { set, where });
    },
    [__type, doSet, options?.fieldsGql, setName]
  );

  return [set, { loading, error }];
}
