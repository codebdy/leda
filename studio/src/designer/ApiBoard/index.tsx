import GraphiQL from "graphiql";
import "graphiql/graphiql.css";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { memo, useMemo } from "react";
import React from "react";
import { HEADER_AUTHORIZATION, TOKEN_PREFIX, HEADER_APPX_APPID, SERVER_SUBSCRIPTION_URL } from "consts";
import "./index.less";
import { useEndpoint, useToken } from "enthooks";
import { useEdittingAppId } from "designer/hooks/useEdittingAppUuid";
import { SubscriptionClient } from "subscriptions-transport-ws";

//例子連接
//https://github.com/graphql/graphiql/blob/main/packages/graphiql-toolkit/docs/create-fetcher.md#subscriptionurl
const ApiBoard = memo(() => {
  const realAppId = useEdittingAppId();
  const token = useToken();
  const endppoint = useEndpoint();
  const fetcher = useMemo(() => {
    const fetcher = createGraphiQLFetcher({
      url: endppoint,
      legacyWsClient: new SubscriptionClient(SERVER_SUBSCRIPTION_URL),
      headers: {
        [HEADER_AUTHORIZATION]: token ? `${TOKEN_PREFIX}${token}` : "",
        [HEADER_APPX_APPID]: realAppId,
      }
    });

    return fetcher;
  }, [endppoint, realAppId, token]);

  return (
    <div className="api-board">
      {fetcher && endppoint && (
        <GraphiQL
          headerEditorEnabled
          fetcher={fetcher}
        // query=""
        />
      )}
    </div>
  );
});

export default ApiBoard;