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
const {UserType, UserInputType} = require("./GraphqlTypes/UserType")

const Campfire = require("./models/CampfireModel");
const {CampfireType, CampfireInputType} = require("./GraphqlTypes/CampfireType")

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            args: {
                usernames: { type: new GraphQLList(GraphQLString)},
            },
            resolve: async (source, args) => {
                if (args.usernames === undefined || args.usernames.length === 0) {
                    return User.find();
                }
                return User.find({
                    'username': {
                        "$in": args.usernames
                    }
                });
            },
        },
        campfires: {
            type: new GraphQLList(CampfireType),
            args: {
                campfireIds: { type: new GraphQLList(GraphQLString) },
            },
            resolve: async (source, args) => {
                if (args.campfireIds === undefined || args.campfireIds.length === 0) {
                    return Campfire.find();
                }
                return Campfire.find({
                    '_id': {
                        "$in": args.campfireIds
                    }
                });
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
                userData: { type: UserInputType },
            },
            resolve: async (source, args) => {
                return await User.create({
                    username: args.userData.username,
                    email: args.userData.email,
                    password: args.userData.password,
                    profilePicture: args.userData.profilePicture,
                    socialMedia: args.userData.socialMedia
                });
            }
        },
        modifyUser: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                userData: { type: UserInputType },
            },
            resolve: async(source, args) => {
                return User.findOneAndUpdate({username: args.username}, {
                    email: args.userData.email,
                    password: args.userData.password,
                    profilePicture: args.userData.profilePicture,
                    socialMedia: args.userData.socialMedia
                }, {new: true});
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
            },
            resolve: async(source, args) => {
                try {
                    await Campfire.updateMany({}, {
                        "$pull": {
                            "followers": args.username
                        }
                    });
                    return await User.findOneAndDelete({username: args.username});
                } catch (e) {
                    return e;
                }
            }
        },
        addCampfire: {
            type: CampfireType,
            args: {
                campfireData: { type: CampfireInputType },
                followers: { type: new GraphQLList(GraphQLString) }
            },
            resolve: async (source, args) => {
                return await Campfire.create({
                    ownerId: args.campfireData.ownerId,
                    title: args.campfireData.title,
                    description: args.campfireData.description,
                    status: args.campfireData.status,
                    followers: args.followers
                });
            }
        },
        modifyCampfireDetails: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
                campfireData: { type: CampfireInputType },
            },
            resolve: async (source, args) => {
                return Campfire.findByIdAndUpdate(args.campfireId, {
                    ownerId: args.campfireData.ownerId,
                    title: args.campfireData.title,
                    description: args.campfireData.description,
                    status: args.campfireData.status,
                }, {new: true});
            }
        },
        addFollowers: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
                usernames: { type: new GraphQLList(GraphQLString)},
            },
            resolve: async (source, args) => {
                return Campfire.findByIdAndUpdate(args.campfireId, {
                    "$push": {
                        "followers": {
                            "$each": args.usernames
                        }
                    }
                }, {new: true, upsert: true});
            }
        },
        deleteFollowers: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
                usernames: { type: new GraphQLList(GraphQLString)},
            },
            resolve: async (source, args) => {
                return Campfire.findByIdAndUpdate(args.campfireId, {
                    "$pullAll": {
                        "followers": args.usernames
                    }
                }, {new: true});
            }
        },
        deleteCampfire: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
            },
            resolve: async(source, args) => {
                return Campfire.findOneAndDelete({_id: args.campfireId});
            }
        },
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
