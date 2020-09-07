const graphql = require("graphql");
const { GraphQLObjectType } = graphql;
const User = require("../models/user");
const Todo = require("../models/todo");
const UserType = require("./UserType");
const TodoType = require("./TodoTypes");
const channel = "New_c";

module.exports = new GraphQLObjectType({
  name: "Subscription",
  fields: {
    newTodo: {
      type: TodoType,
      async subscribe(_, __, ctx) {
        ctx.pubsub.asyncIterator(channel);
      },
    },
  },
});
