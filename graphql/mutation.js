const graphql = require("graphql");
const { GraphQLObjectType } = graphql;
const User = require("../models/user");
const Todo = require("../models/todo");
const UserType = require("./UserType");
const TodoType = require("./TodoTypes");
module.exports = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: graphql.GraphQLString },
        password: { type: graphql.GraphQLString },
        emailId: { type: graphql.GraphQLString },
      },
      async resolve(parent, args) {
        const user_ = await User.findOne({
          $or: [{ username: args.username }, { emailId: args.emailId }],
        });
        if (user_) {
          return null;
        }
        let user = new User({
          username: args.username,
          password: args.password,
          emailId: args.emailId,
        });
        return user.save();
      },
    },
    addTodo: {
      type: TodoType,
      args: {
        todo: { type: graphql.GraphQLString },
      },
      async resolve(parent, args, ctx) {
        const todo = new Todo({
          todo: args.todo,
          ofUser: ctx.user.id,
        }).save();
        ctx.pubsub.publish("New_c", {
          newTodo: todo,
        });
        return todo;
      },
    },
    markDone: {
      type: graphql.GraphQLString,
      args: {
        id: { type: graphql.GraphQLString },
      },
      async resolve(parent, args, ctx) {
        if (ctx.user.id) {
          await Todo.findOneAndDelete({
            $and: [{ _id: args.id }, { ofUser: args.username }],
          });
        }
      },
    },
  },
});
