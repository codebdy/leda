// form https://medium.com/profusion-engineering/file-uploads-graphql-and-apollo-federation-c5a878707f4c
// this code not use yet
class InspectionDataSource extends RemoteGraphQLDataSource {
  static extractFileVariables(rootVariables) {
    Object.values(rootVariables || {}).forEach((value) => {
      if (value instanceof Promise) {
        // this is a file upload!
        console.log(value);
      }
    });
  }

  process(args) {
    InspectionDataSource.extractFileVariables(args.request.variables);
    return super.process(args);
  }
}
/// Js code...

const apolloGateway = new ApolloGateway({
  buildService: ({ url }) => new InspectionDataSource({ url }),
  serviceList: [
      {
        name: "user",
        url: "http://localhost:4001/graphql"
      }
    ]
  });

// Js code...