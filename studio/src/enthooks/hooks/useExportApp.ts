import { useCallback } from "react"
import { ID } from "shared"
import { gql } from "../awesome-graphql-client";
import { RequestOptions, useLazyRequest } from "./useLazyRequest";

const queryGql = gql`
  query ($snapshotId: ID!) {
    exportApp(snapshotId: $snapshotId)
  }
`;

export function useExportApp(options?: RequestOptions<any>): [
  (snapshotId: ID) => void,
  {
    error?: Error,
    loading?: boolean,
  }
] {
  const [doExport, { error, loading }] = useLazyRequest(options)

  const exportApp = useCallback((snapshotId: ID) => {
    return doExport(queryGql, { snapshotId })
  }, [doExport])

  return [exportApp, { error, loading }]
}