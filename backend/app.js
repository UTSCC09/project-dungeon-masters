const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList, GraphQLInputObjectType,
} = require("graphql");
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

const User = require("./models/userModel");

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        user: {
            type: new GraphQLList(UserType),
            resolve: async () => {
                const docs = await User.find();
                console.log(docs);
                return docs;
            },
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addUser: {
            type: UserType,
            args: {
                input: { type: new GraphQLInputObjectType({
                        name: "UserInputObject",
                        fields: () => ({
                            username: {
                                type: GraphQLString,
                            },
                            email: {
                                type: GraphQLString
                            },
                            password: {
                                type: GraphQLString
                            },
                            profilePicture: {
                                type: GraphQLString
                            },
                            socialMedia: {
                                type: new GraphQLInputObjectType({
                                    name: "socialMediaInput",
                                    fields: () => ({
                                        twitter: {type: GraphQLString},
                                        instagram: {type: GraphQLString}
                                    })
                                })
                            }
                        }),
                    })},
            },
            resolve: async (source, userData) => {
                const user = await User.create({
                    username: userData.input.username,
                    email: userData.input.email,
                    password: userData.input.password,
                    profilePicture: userData.input.profilePicture,
                    socialMedia: userData.input.socialMedia
                })
                return user;
            }
        }
    }),
});

const UserType = new GraphQLObjectType({
    name: "User",
    description: "This is a user object",
    fields: () => ({
        username: {
            type: GraphQLString,
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        profilePicture: {
            type: GraphQLString
        },
        socialMedia: {
            type: new GraphQLObjectType({
                name: "socialMedia",
                fields: () => ({
                    twitter: {type: GraphQLString},
                    instagram: {type: GraphQLString}
                })
            })
        }
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
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
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
