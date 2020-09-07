const graphql = require("graphql");
const { GraphQLObjectType } = graphql;

module.exports = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: graphql.GraphQLID },
    username: { type: graphql.GraphQLString },
    emailId: { type: graphql.GraphQLString },
    password: { type: graphql.GraphQLString },
  }),
});
