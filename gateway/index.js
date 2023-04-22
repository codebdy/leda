const { ApolloServer, gql } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const { readFileSync } = require("fs");
import { GraphQLClient } from "graphql-request";

var services
const port = 8081;
const gqlstr = `
  query{
    services{
      id
      name
      url
    }
  }
`;

const graphQLClient = new GraphQLClient(
  "http://localhost:8080/graphql",
  {
    mode: "cors",
  }
);
graphQLClient
  .request(gqlstr)
  .then((data) => {
    if (data) {
      services = data["services"]
      const gateway = new ApolloGateway({
        supergraphSdl: new IntrospectAndCompose({
          subgraphs:services,
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
    return
  });

