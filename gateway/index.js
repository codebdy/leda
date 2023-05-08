const { ApolloServer, gql } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const { readFileSync } = require("fs");
import { GraphQLClient } from "graphql-request";

var services;
const port = 8081;
const gqlstr = `
  query{
    services{
      id
      name
      port
    }
  }
`;

const graphQLClient = new GraphQLClient("http://models:4000/graphql", {
  mode: "cors",
});
graphQLClient
  .request(gqlstr)
  .then((data) => {
    if (data) {
      services = [...data["services"], { name: "models", port: "4000" }];
      const gateway = new ApolloGateway({
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: services?.map((service) => ({
            ...service,
            url: `${service.name}:${service.port}/graphql`,
          })),
        }),
      });

      // Pass the ApolloGateway to the ApolloServer constructor
      const server = new ApolloServer({
        gateway,
      });

      server.listen({ port }).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
      });
    }
  })
  .catch((err) => {
    console.error(err);
    return;
  });
