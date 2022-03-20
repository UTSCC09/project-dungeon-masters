const {GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLBoolean} = require("graphql");
const {default: mongoose} = require("mongoose");

const CampfireType = new GraphQLObjectType({
    name: "Campfire",
    description: "This is a campfire object",
    fields: () => ({
        _id: {
            type: GraphQLString
        },
        ownerUsername: {
            type: GraphQLString,
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        status: {
            type: GraphQLString
        },
        private: {
            type: GraphQLBoolean
        },
        passcode: {
            type: GraphQLString
        },
        thumbnail: {
            type: GraphQLString
        },
        soundtrack: {
            type: new GraphQLList(GraphQLString)
        },
        scenes: {
            type: new GraphQLList(GraphQLString)
        },
        followers: {
            type: new GraphQLList(GraphQLString)
        }
    }),
});

const CampfireInputType = new GraphQLInputObjectType({
    name: "CampfireInputObject",
    fields: () => ({
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        status: {
            type: GraphQLString
        },
        private: {
            type: GraphQLBoolean
        },
        passcode: {
            type: GraphQLString
        },
        thumbnail: {
            type: GraphQLString
        },
        soundtrack: {
            type: new GraphQLList(GraphQLString)
        },
        scenes: {
            type: new GraphQLList(GraphQLString)
        }
    }),
})

module.exports = {CampfireType, CampfireInputType}
