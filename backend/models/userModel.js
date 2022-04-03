const { default: mongoose } = require("mongoose");
const {GraphQLString} = require("graphql");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: String,
    description: String,
    socialMedia: {
        twitter: {
            type: String,
            trim: true
        },
        instagram: {
            type: String,
            trim: true
        }
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("user", userSchema);
