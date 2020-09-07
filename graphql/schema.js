const graphql = require("graphql");
const { GraphQLSchema } = graphql;

const Mutation = require("./mutation");
const RootQuery = require("./query");
const Subscription = require("./subscription");

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
  subscription: Subscription,
});
