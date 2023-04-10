import { useRef, useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useEndpoint } from 'enthooks';
import { EVENT_DATA_POSTED, EVENT_DATA_REMOVED, EVENT_DATA_UPDATED, off, on } from 'enthooks/events';
import { useLazyRequest } from 'enthooks/hooks/useLazyRequest';
import { MutateFn } from 'enthooks/hooks/useQueryOne';
import { IQueryParams } from './useQueryParams';

export type QueryResponse = {
  data?: any;
  refresh: MutateFn<any>;
  loading?: boolean;
  revalidating?: boolean;
  error?: Error;
}

export function useDataQuery(params?: IQueryParams): QueryResponse {
  const [revalidating, setRevalidating] = useState<boolean>();
  const endpoint = useEndpoint();
  const refreshRef = useRef<() => void>();

  const [doLoad, { error, data, loading }] = useLazyRequest<any>({
    onCompleted: (data) => {
      setRevalidating(false)
    },
    onError: () => {
      setRevalidating(false)
    }
  })

  const load = useCallback(() => {
    console.log("DataQuery 加载", params)
    if (!params?.gql || !endpoint) {
      return
    }
    //console.log("doLoad:", params?.gql)
    doLoad(params?.gql, params?.variables)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, params?.gql, params?.variables, params?.refreshFlag]);

  const refresh = useCallback(() => {
    setRevalidating(true)
    doLoad(params?.gql, params?.variables)
  }, [doLoad, params?.gql, params?.variables])

  refreshRef.current = refresh;

  const eventHandler = useCallback((event: CustomEvent) => {
    if (params?.entityName === event.detail?.entity) {
      if (refreshRef.current) {
        refreshRef.current();
      }
    }
  }, [params?.entityName]);

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

  return {
    data: data?.[params?.rootFieldName as any],
    loading: (revalidating ? false : loading),
    revalidating,
    error,
    refresh
  }
}