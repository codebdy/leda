import { useRef, useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useLazyRequest } from "./useLazyRequest";
import { useEndpoint } from "../context";
import { EVENT_DATA_POSTED, EVENT_DATA_REMOVED, EVENT_DATA_UPDATED, off, on } from "../events";
import { MutateFn } from './useQueryOne';
import { IQueryInput } from './IQueryInput';
import { GraphQLRequestError } from '../awesome-graphql-client';

export interface QueryResult<T> {
  [key: string]: {
    nodes?: T[] | undefined;
    total?: number
  }
}

export type QueryResponse<T> = {
  data?: QueryResult<T>;
  refresh: MutateFn<T>;
  loading?: boolean;
  revalidating?: boolean;
  error?: GraphQLRequestError;
}

export function useQuery<T>(input: IQueryInput): QueryResponse<T> {
  const [revalidating, setRevalidating] = useState<boolean>();
  const loadedRef = useRef(false);
  const endpoint = useEndpoint();
  const refreshRef = useRef<() => void>();

  const [doLoad, { error, data, loading }] = useLazyRequest<QueryResult<T>>({
    onCompleted: (data) => {
      setRevalidating(false)
    },
    onError: () => {
      setRevalidating(false)
    }
  })

  const load = useCallback(() => {
    if (!input.gql || !endpoint || loadedRef.current) {
      return
    }
    loadedRef.current = true;
    doLoad(input.gql, input.params)
  }, [doLoad, endpoint, input.gql, input.params]);

  const refresh = useCallback(() => {
    setRevalidating(true)
    doLoad(input.gql, input.params)
  }, [doLoad, input.gql, input.params])

  refreshRef.current = refresh;

  const eventHandler = useCallback((event: CustomEvent) => {
    if (input.depEntityNames?.find(entity => entity === event.detail?.entity)) {
      if (refreshRef.current) {
        refreshRef.current();
      }
    }
  }, [input.depEntityNames]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    on(EVENT_DATA_POSTED, eventHandler as any);
    on(EVENT_DATA_REMOVED, eventHandler as any);
    on(EVENT_DATA_UPDATED, eventHandler as any);
    return () => {
      off(EVENT_DATA_POSTED, eventHandler as any);
      off(EVENT_DATA_REMOVED, eventHandler as any);
      off(EVENT_DATA_UPDATED, eventHandler as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading: (revalidating ? false : loading), revalidating, error, refresh }
}