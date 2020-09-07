const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const cors = require("cors");
const schema = require("./graphql/schema");
app.use(cors());
const PORT = 3005;
mongoose
  .connect("mongodb://localhost:27017/graphqldata", { useNewUrlParser: true })
  .then(() => {
    console.log("connected to db");
  });
let data = {};

const authe = async function (req, res, next) {
  try {
    if (!req.body.variables) {
      data = {};
      next();
    } else {
      const token = await req.body.variables.Authorization.split(" ")[1];
      const decode = jwt.verify(token, "abcd1234");
      if (decode) {
        data = decode;
        next();
      } else {
        res.status(400).json({ message: "Invalid User" });
      }
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid User" });
  }
};
const pubsub = new PubSub();
app.use(
  "/graphql",
  bodyParser.json(),
  authe,
  graphqlHTTP((req) => ({
    schema,
    context: {
      user: data,
      pubsub,
    },
    graphiql: true,
  }))
);

app.listen(PORT, () => {
  console.log(`connect at ${PORT}`);
});
