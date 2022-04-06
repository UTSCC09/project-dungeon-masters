const bcrypt = require("bcrypt");
const fs = require("fs");
const express = require("express");

const expressGraphQL = require("express-graphql").graphqlHTTP;
const GraphQLJSON = require("graphql-type-json").GraphQLJSON;

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt,
} = require("graphql");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { body, validationResult } = require("express-validator");

const saltRounds = 10;

const cookie = require("cookie");

const https = require("https");
const { resolve, join } = require("path");
const { hash } = require("bcrypt");
const { aggregate } = require("./models/userModel");
const PORT = 4000;
const privateKey = fs.readFileSync( '52_8_249_5.key' );
const certificate = fs.readFileSync( '52_8_249_5.pem' );
const config = {
    key: privateKey,
    cert: certificate
};
const server = https.createServer(config, app);

const session = require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: null,
        sameSite: true,
    },
});
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: function (origin, callback) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) {
                return callback(null, true);
            }
            if (whitelist.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        allowedHeaders: ["cfstorylobby"],
    },
});

const sharedsession = require("express-socket.io-session");

app.use(bodyParser.urlencoded({ extended: false }));
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "-" + Date.now());
    },
});
const upload = multer({ storage: storage });
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink);

app.use(session);

app.use(function (req, res, next) {
    req.username =
        req.session && req.session.username ? req.session.username : null;
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
});

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database"));

const User = require("./models/userModel");
const { UserType, UserInputType } = require("./GraphqlTypes/UserType");

const Campfire = require("./models/CampfireModel");
const {
    CampfireType,
    CampfireInputType,
} = require("./GraphqlTypes/CampfireType");

const Image = require("./models/imageModel");
const SoundEffect = require("./models/soundEffectModel");

const isAuthenticated = (req, res, next) => {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

const signInUser = (req, res, user) => {
    req.session.username = user.username.trim();
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("username", user.username, {
            path: "/",
            maxAge: null,
            secure: false,
            sameSite: true,
        })
    );
    return res.json({
        socialMedia: user.socialMedia,
        date: user.date,
        _id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        description: user.description
    });
};

const signOutUser = (req, res) => {
    req.session.destroy();
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("username", "", {
            path: "/",
            maxAge: null,
        })
    );
};

const {soundFXCaller} = require("./CampFireSound/SoundFXCaller");
const {speechToText} = require("./CampFireSound/googleSpeechToTextApi");

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve: async (source, args, context) => {
                return User.find({
                    username: {
                        $in: context.session.username,
                    },
                });
            },
        },
        campfires: {
            type: new GraphQLList(CampfireType),
            args: {
                campfireId: { type: GraphQLString },
                owned: { type: GraphQLBoolean },
                follower: { type: GraphQLBoolean },
                page: { type: GraphQLInt },
                title: { type: GraphQLString }
            },
            resolve: async (source, args, context) => {
                if (args.campfireId !== undefined && args.campfireId !== "")
                    return [Campfire.findById(args.campfireId)];

                let filter = (owned, follower, match) => {
                    let filter = { $or: [] };
                    if (owned)
                        filter.$or.push({
                            ownerUsername: context.session.username,
                        });
                    if (follower)
                        filter.$or.push({
                            followers: {
                                $elemMatch: { username: context.session.username },
                            },
                        });
                    if (filter.$or.length === 0) filter = {};

                    if (match)
                        return {$and:[{title: {$regex: match, $options: "i"}}, filter]};

                    return filter;
                };
                return Campfire.find(filter(args.owned, args.follower, args.title))
                    .sort({date: -1})
                    .skip(args.page !== -1 ? args.page * 10 : 0)
                    .limit(args.page !== -1 ? 10 : 0);
            },
        },
        getCampfireRole: {
            type: GraphQLString,
            args: {
                campfireId: { type: GraphQLString },
            },
            resolve: async (source, args, context) => {
                let campfireDetails = await Campfire.find({
                    _id: args.campfireId,
                });
                if (
                    campfireDetails[0].ownerUsername ===
                    context.session.username
                )
                    return "owner";
                if (
                    campfireDetails[0].followers.includes(
                        context.session.username
                    )
                )
                    return "follower";
                return "none";
            },
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        modifyUser: {
            type: UserType,
            args: {
                userData: { type: UserInputType },
            },
            resolve: async (source, args, context) => {
                return User.findOneAndUpdate(
                    { username: context.session.username },
                    {
                        password: args.userData.password,
                        profilePicture: args.userData.profilePicture,
                        description: args.userData.description,
                        socialMedia: args.userData.socialMedia,
                    },
                    { new: true }
                );
            },
        },
        deleteUser: {
            type: UserType,
            resolve: async (source, args, context) => {
                try {
                    await Campfire.updateMany(
                        {},
                        {
                            $pull: {
                                followers: args.username,
                            },
                        }
                    );
                    await Campfire.deleteMany({
                        ownerUsername: context.session.username,
                    });
                    const deletedUser = await User.findOneAndDelete({
                        username: context.session.username,
                    });

                    return deletedUser;
                } catch (e) {
                    return e;
                }
            },
        },
        addCampfire: {
            type: CampfireType,
            args: {
                campfireData: { type: CampfireInputType },
            },
            resolve: async (source, args, context) => {
                return await Campfire.create({
                    ownerUsername: context.session.username,
                    title: args.campfireData.title,
                    description: args.campfireData.description,
                    status: args.campfireData.status,
                    private: args.campfireData.private,
                    passcode: args.campfireData.passcode,
                    thumbnail: args.campfireData.thumbnail,
                    soundtrack: args.campfireData.soundtrack,
                    scenes: args.campfireData.scenes,
                    followers: [],
                    ownerSocketId: "",
                });
            },
        },
        modifyCampfireDetails: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
                campfireData: { type: CampfireInputType },
            },
            resolve: async (source, args, context) => {
                return Campfire.findOneAndUpdate(
                    {
                        _id: args.campfireId,
                        ownerUsername: context.session.username,
                    },
                    {
                        title: args.campfireData.title,
                        description: args.campfireData.description,
                        status: args.campfireData.status,
                    },
                    { new: true }
                );
            },
        },
        addFollowers: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
                usernames: { type: new GraphQLList(GraphQLString) },
            },
            resolve: async (source, args, context) => {
                return Campfire.findOneAndUpdate(
                    {
                        _id: args.campfireId,
                        ownerUsername: context.session.username,
                    },
                    {
                        $addToSet: {
                            followers: {
                                $each: {
                                    username: args.usernames,
                                    socketId: "",
                                },
                            },
                        },
                    },
                    { new: true }
                );
            },
        },
        deleteFollowers: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
                usernames: { type: new GraphQLList(GraphQLString) },
            },
            resolve: async (source, args, context) => {
                return Campfire.findOneAndUpdate(
                    {
                        _id: args.campfireId,
                        ownerUsername: context.session.username,
                    },
                    {
                        $pullAll: {
                            followers: { username: args.usernames },
                        },
                    },
                    { new: true }
                );
            },
        },
        deleteCampfire: {
            type: CampfireType,
            args: {
                campfireId: { type: GraphQLString },
            },
            resolve: async (source, args, context) => {
                return Campfire.findOneAndDelete({
                    _id: args.campfireId,
                    ownerUsername: context.session.username,
                });
            },
        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});

var whitelist = [
    "https://localhost:3000",
    "https://localhost:4000" /** other domains if any */,
    "https://campfirestory.me",
    "https://52.8.249.5:4000",
];

var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        if (whitelist.indexOf(origin) === -1) {
            var msg =
                "The CORS policy for this site does not " +
                "allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
};

app.use(cors(corsOptions));

app.post("/signup/", async function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password.trim(), salt, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });
    });

    let user;
    try {
        user = await User.create({
            username: username,
            password: hashedPassword,
            profilePicture: "",
            description: "",
            socialMedia: {
                twitter: "",
                instagram: "",
            },
        });
        return signInUser(req, res, user);
    } catch (e) {
        if (e.code === 11000)
            return res
                .status(409)
                .end("username " + username + " already exists");
        else return res.status(500).end(e);
    }
});

app.post("/signin/", async function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    const userDocs = await User.find({
        username: username.trim(),
    });
    if (userDocs === undefined || userDocs[0] === undefined)
        return res.status(401).end("Invalid username or password");

    let user = userDocs[0];
    let validPass = await bcrypt.compare(password.trim(), user.password);

    if (validPass) {
        return signInUser(req, res, user);
    } else {
        return res.status(401).end("Invalid username or password");
    }
});

app.get("/signout/", async function (req, res, next) {
    signOutUser(req, res);
    return res.redirect("/");
});

app.use("/graphql", isAuthenticated, (req, res, next) => {
    expressGraphQL({
        schema: schema,
        context: {
            session: req.session,
            res: res,
        },
        graphiql: true,
    })(req, res, next);
});

app.post(
    "/api/images/",
    isAuthenticated,
    upload.single("picture"),
    function (req, res, next) {
        var obj = {
            img: {
                data: Buffer.from(
                    fs
                        .readFileSync(
                            join(__dirname + "/uploads/" + req.file.filename)
                        )
                        .toString("base64"),
                    "base64"
                ),
                contentType: req.file.mimetype,
                path: req.file.path,
            },
            url: "",
        };
        Image.create(obj, (err, image) => {
            if (err) {
                return res.status(500).end(err);
            } else {
                Image.findOneAndUpdate(
                    {
                        _id: image._id,
                    },
                    {
                        url: "/api/images/picture/" + image._id,
                    },
                    { new: true },
                    (err, newImage) => {
                        if (err) {
                            return res.status(500).end(err);
                        }
                        res.json({ url: "/api/images/picture/" + image._id });
                    }
                );
            }
        });

        unlinkAsync(__dirname + "/uploads/" + req.file.filename)
    }
);

//TODO: Remove
app.post(
    "/api/audio/",
    isAuthenticated,
    upload.single("file"),
    function (req, res, next) {
        let obj = {
            entity: req.body.entity,
            context: req.body.context,
            sfx: {
                data: Buffer.from(
                    fs
                        .readFileSync(
                            join(__dirname + "/uploads/" + req.file.filename)
                        )
                        .toString("base64"),
                    "base64"
                ),
                contentType: req.file.mimetype,
                path: req.file.path,
            },
            url: "",
        };

        SoundEffect.create(obj, (err, sfx) => {
            if (err) {
                return res.status(500).end(err);
            } else {
                SoundEffect.findOneAndUpdate(
                    {
                        _id: sfx._id,
                    },
                    {
                        url: "/api/audio/sfx/" + sfx._id,
                    },
                    { new: true },
                    (err, newImage) => {
                        if (err) {
                            return res.status(500).end(err);
                        }
                        res.json({ url: "/api/audio/sfx/" + sfx._id });
                    }
                );
            }
        });

        unlinkAsync(__dirname + "/uploads/" + req.file.filename)
    }
);

app.get("/api/images/picture/:id", function (req, res, next) {
    Image.findOne({ _id: req.params.id }, function (err, image) {
        if (err) {
            return res.status(500).end(err);
        }
        if (!image) {
            return res
                .status(404)
                .end("Image with id:" + req.params.id + " does not exist.");
        } else {
            res.setHeader("Content-Type", image.img.contentType);
            res.send(image.img.data);
        }
    });
});

app.get("/api/audio/sfx/:id", function (req, res, next) {
    SoundEffect.findById(req.params.id, function (err, soundEffect) {
        if (err) {
            return res.status(500).end(err.toString());
        }
        if (!soundEffect) {
            return res
                .status(404)
                .end("Sound effect with id:" + req.params.id + " does not exist.");
        } else {
            res.setHeader("Content-Type", soundEffect.sfx.contentType);
            res.send(soundEffect.sfx.data);
        }
    });
});

io.use(
    sharedsession(session, {
        autoSave: true,
    })
);

// on is like an event listener, listening an emit event from client
// emit is pushing an event to trigger on
io.on("connection", (socket) => {
    function SendAllUserSockets(err, campfire) {
        if(err) {
            console.log(err);
            res.send(err);
            return;}
        const joinedSocketsInRoom = campfire.followers.filter(
            (follower) =>
                follower.socketId &&
                follower.socketId !== socket.id &&
                follower.socketId !== ""
        );
        if(campfire.ownerUsername !== socSession.username){
            joinedSocketsInRoom.push({
                username: campfire.ownerUsername,
                socketId: campfire.ownerSocketId,
            });
        }
        socket.emit("allusers", joinedSocketsInRoom);
    }

    const socSession = socket.handshake.session;
    socket.on("joinroom", (lobbyId) => {
        //check if user is alreay in the lobby; if not, don't emit any signal/disconnect immediately
        //first check if it is the owner joining in
        Campfire.findOne(
            { _id: lobbyId, ownerUsername: socSession.username },
            function (err, campfire) {
                //
                if (campfire) {
                    // session user is owner
                    if (
                        !campfire.ownerSocketId ||
                        campfire.ownerSocketId === ""
                    ) {
                        Campfire.findOneAndUpdate(
                            { _id: lobbyId },
                            { ownerSocketId: socket.id },
                            { new: true },
                            SendAllUserSockets
                        );
                    } else {
                        socket.emit("error", "User joined on a different tab.");
                    }
                } else {
                    Campfire.findOne(
                        { _id: lobbyId, ownerSocketId: { $ne: "" } },
                        function (err, campfire) {
                            // follower joining, check if owner is there.
                            if (
                                !campfire ||
                                campfire.ownerSocketId === undefined ||
                                err
                            ) {
                                // handle not found
                                socket.emit(
                                    "error",
                                    "The campfire is either not active or does not exist."
                                );
                            } else if (
                                campfire.followers.find(
                                    (follower) =>
                                        follower.username ===
                                            socSession.username &&
                                        follower.socketId !== ""
                                )
                            ) {
                                socket.emit(
                                    "error",
                                    "User joined on a different tab."
                                );
                            } else if (campfire.followers.length < 16) {
                                // if session.username is same as owner, add a field that keeps it's socket

                                if (campfire.followers.find((follower) => follower.username === socSession.username && follower.socketId === "")){
                                        Campfire.findOneAndUpdate(
                                            { _id: lobbyId, "followers.username": socSession.username },
                                            {
                                                $set: {
                                                    "followers.$.socketId": socket.id,
                                                    },
                                            },
                                            { new: true },
                                            SendAllUserSockets
                                        );
                                }else{
                                    Campfire.findOneAndUpdate(
                                        { _id: lobbyId },
                                        {
                                            $addToSet: {
                                                followers: {
                                                    username: socSession.username,
                                                    socketId: socket.id,
                                                },
                                            },
                                        },
                                        { new: true },
                                        SendAllUserSockets
                                    );
                                }
                            } else {
                                socket.emit(
                                    "error",
                                    "The campfire is full, please enter later."
                                );
                            }
                        }
                    );
                }
            }
        );
    });

    socket.on("sendingsignal", (payload) => {
        io.to(payload.userToSignal).emit("userjoined", {
            signal: payload.signal,
            callerID: payload.callerID,
        });
    });

    socket.on("returningsignal", (payload) => {
        io.to(payload.callerID).emit("receivingreturnedsignal", {
            signal: payload.signal,
            id: socket.id,
        });
    });

    socket.on("disconnect", () => {
        // disconnects socket, basically remove socket id from room
        // if disconnecting a follower

        Campfire.findOneAndUpdate(
            { "followers.socketId": socket.id },
            {
                $set: { "followers.$.socketId": "" }
            },
            { new: true },
            function (err, campfire) {
                if(err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                if(campfire){
                    socket.broadcast.emit("userleft", socket.id);
                }else{
                    // if disconnecting owner
                    // if user that is leaving is owner, send a different signal so frontend shows a message to force others to leave
                    Campfire.findOneAndUpdate({ ownerSocketId: socket.id }, { ownerSocketId:"" }, function(err, campfire){
                        speechToText.stopRecognitionStream();
                        socket.broadcast.emit('ownerleft', {id: socket.id,message:"The narrator has left the campfire, you will be redirected to the home page."});
                    });
                }
            }
        );
    });

    socket.on("changeImg", (index) => {
        socket.broadcast.emit("changeImg", index);
    })

    socket.on('startGoogleCloudStream', () => {
        console.log("Starting google cloud speech to text")
        speechToText.startRecognitionStream(socket, (transcript) => {
            return soundFXCaller.determineSFXCalls(transcript, (entities) => {
                let soundsCalled = [];
                for (const entity in entities) {
                    SoundEffect.findOne({entity: entity}, {}, {}, (err, soundEffect) => {
                        if (err || !soundEffect) {
                            return;
                        }
                        console.log("Before playing: ", soundsCalled, "[", transcript, "]");
                        if (!soundsCalled.includes(entity)) {
                            soundsCalled.push(entity);
                            console.log("Entity: [", entity, "] played sfx: [", soundEffect.url, "]");
                            io.emit("playSFX", soundEffect.url);
                        }
                    })
                }
            });
        });
    });

    socket.on('binaryAudioData', (data) => {
        speechToText.receiveData(data);
    });

    socket.on('endGoogleCloudStream', () => {
        speechToText.stopRecognitionStream();
    });
});

server.listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPs server on https://localhost:%s", PORT);
});
