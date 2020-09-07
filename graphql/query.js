const graphql = require("graphql");
const { GraphQLObjectType } = graphql;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Todo = require("../models/todo");

const UserType = require("./UserType");

const TodoType = require("./TodoTypes");

module.exports = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: graphql.GraphQLString,
      args: {
        username: { type: graphql.GraphQLString },
        password: { type: graphql.GraphQLString },
      },
      async resolve(parent, args) {
        const user = await User.findOne({ username: args.username });
        if (user) {
          if (user.password === args.password) {
            const token = jwt.sign(
              { id: user.id, username: user.username },
              "abcd1234"
            );
            return token;
          } else {
            throw new Error("Invalid password");
          }
        } else {
          throw new Error("Invalid username");
        }
      },
    },
    getTodo: {
      type: new graphql.GraphQLList(TodoType),
      async resolve(parent, args, context) {
        return Todo.find({ ofUser: context.user.id });
      },
    },

    me: {
      type: UserType,
      async resolve(_, args, ctx) {
        const user = await User.findById(ctx.user.id);
        console.log(user);
        return user;
      },
    },
  },
});
