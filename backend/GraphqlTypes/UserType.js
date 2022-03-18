const {GraphQLObjectType, GraphQLString, GraphQLInputObjectType} = require("graphql");
const {default: mongoose} = require("mongoose");

const UserType = new GraphQLObjectType({
    name: "User",
    description: "This is a user object",
    fields: () => ({
        _id: {
            type: GraphQLString,
        },
        username: {
            type: GraphQLString,
        },
        email: {
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

const UserInputType = new GraphQLInputObjectType({
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
})

module.exports = {UserType, UserInputType}
