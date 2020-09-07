const graphql = require("graphql");
const { GraphQLObjectType } = graphql;

module.exports = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    _id: { type: graphql.GraphQLString },
    todo: { type: graphql.GraphQLString },
  }),
});
