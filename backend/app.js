const bcrypt = require("bcrypt");
const fs = require("fs");
const express = require("express");

const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList, GraphQLBoolean,
} = require("graphql");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require('cors');

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { body, validationResult } = require("express-validator");

const saltRounds = 10;

const cookie = require("cookie");

const session = require("express-session");

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

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

const isAuthenticated = (context) => {
    if (!context.session.username) throw new Error("Not Authenticated");
}

const signInUser = (context, user) => {
    context.session.username = user.username.trim();
    context.res.setHeader('Set-Cookie', cookie.serialize('username', user._id, {
        path: '/',
        maxAge: null,
        secure: false,
        sameSite: true
    }));
}

const signOutUser = (context) => {
    context.session.destroy();
    context.res.setHeader('Set-Cookie', cookie.serialize('username', '', {
        path: '/',
        maxAge: null
    }));
}

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            args: {
                usernames: { type: new GraphQLList(GraphQLString)},
            },
            resolve: async (source, args, context) => {
                console.log(context);
                isAuthenticated(context);
                if (args.usernames === undefined || args.usernames.length === 0) {
                    return User.find();
                }
                return User.find({
                    'username': {
                        "$in": args.usernames.trim()
                    }
                });
            },
        },
        campfires: {
            type: new GraphQLList(CampfireType),
            args: {
                owned: { type: GraphQLBoolean },
            },
            resolve: async (source, args, context) => {
                isAuthenticated(context);
                if (args.owned === undefined || !args.owned) {
                    return Campfire.find();
                }
                return Campfire.find({ownerUsername: context.session.username});
            },
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        signUp: {
            type: UserType,
            args: {
                username: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            resolve: async (source, args, context) => {
                const hashedPassword = await new Promise((resolve, reject) => {
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        bcrypt.hash(args.password.trim(), salt, (err, hash) => {
                            if (err) reject(err)
                            resolve(hash)
                        });
                    });
                })

                let user = await User.create({
                    username: args.username,
                    password: hashedPassword,
                    profilePicture: "",
                    socialMedia: {
                        twitter: "",
                        instagram: ""
                    }
                });

                signInUser(context, user);

                return user;
            }
        },
        signIn: {
            type: UserType,
            args: {
                username: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            resolve: async (source, args, context) => {
                const userDocs = await User.find({username: args.username.trim()});
                if (userDocs === undefined || userDocs[0] === undefined) throw new Error("User not found");

                let user = userDocs[0];
                let validPass = await bcrypt.compare(args.password.trim(), user.password);

                if (validPass) {
                    signInUser(context, user);
                } else {
                    throw new Error("Invalid Password");
                }

                return user;
            }
        },
        signOut: {
            type: UserType,
            resolve: async (source, args, context) => {
                signOutUser(context)

                return new User;
            }
        },
        modifyUser: {
            type: UserType,
            args: {
                userData: { type: UserInputType },
            },
            resolve: async(source, args, context) => {
                isAuthenticated(context);
                return User.findOneAndUpdate({username: context.session.username}, {
                    password: args.userData.password,
                    profilePicture: args.userData.profilePicture,
                    socialMedia: args.userData.socialMedia
                }, {new: true});
            }
        },
        deleteUser: {
            type: UserType,
            resolve: async(source, args, context) => {
                isAuthenticated(context);
                try {
                    await Campfire.updateMany({}, {
                        "$pull": {
                            "followers": args.username
                        }
                    });
                    await Campfire.deleteMany({ownerUsername: context.session.username});
                    const deletedUser = await User.findOneAndDelete({username: context.session.username});

                    signOutUser(context)

                    return deletedUser;
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
            resolve: async (source, args, context) => {
                isAuthenticated(context);
                return await Campfire.create({
                    ownerUsername: context.session.username,
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
            resolve: async (source, args, context) => {
                isAuthenticated(context);
                return Campfire.findOneAndUpdate({_id: args.campfireId, ownerUsername: context.session.username}, {
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
            resolve: async (source, args, context) => {
                isAuthenticated(context);
                return Campfire.findOneAndUpdate({
                    _id: args.campfireId,
                    ownerUsername: context.session.username
                }, {
                    "$addToSet": {
                        "followers": {
                            "$each": args.usernames
                        }
                    }
                }, {new: true});
            }
        },
        deleteFollowers: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
                usernames: { type: new GraphQLList(GraphQLString)},
            },
            resolve: async (source, args, context) => {
                isAuthenticated(context);
                return Campfire.findOneAndUpdate({
                    _id: args.campfireId,
                    ownerUsername: context.session.username
                }, {
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
            resolve: async(source, args, context) => {
                isAuthenticated(context);
                return Campfire.findOneAndDelete({
                    _id: args.campfireId,
                    ownerUsername: context.session.username
                });
            }
        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});


var whitelist = ['http://localhost:3000', /** other domains if any */ ]
var corsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));
app.use(
    "/graphql",
    (req, res, next) => {
        expressGraphQL({
            schema: schema,
            context: {
                session: req.session,
                res: res
            },
            graphiql: true
        })(req, res, next)
    }
);

const http = require("http");
const { resolve } = require("path");
const {hash} = require("bcrypt");
const PORT = 4000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
