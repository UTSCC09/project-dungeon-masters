const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { body, validationResult } = require("express-validator");

const cookie = require("cookie");

const session = require("express-session");
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            path: "/",
            httpOnly: true,
            secure: false,
            maxAge: null,
            sameSite: true,
        },
    })
);

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database"));

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        message: {
            type: GraphQLString,
            args: {
                name: {
                    type: GraphQLString,
                },
            },
            resolve: (parent, args) => `Hello World, ${args.name}!`,
        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
});

app.use(
    "/graphql",
    expressGraphQL({
        schema: schema,
        graphiql: true,
    })
);

const http = require("http");
const { resolve } = require("path");
const PORT = 5000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
