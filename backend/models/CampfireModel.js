const { default: mongoose } = require("mongoose");

const campfireSchema = new mongoose.Schema({
    ownerUsername: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String
    },
    private: {
        type: Boolean
    },
    passcode: {
        type: String
    },
    thumbnail: {
        type: String
    },
    soundtrack: [ { type: String } ],
    scenes: [ { type: String } ],
    followers: [ { 
        socketId: {
            type: String
        },
        username: {
            type: String,
            trim: true
        }
    } ],
    ownerSocketId: {
        type: String
    },
});

module.exports = mongoose.model("campfire", campfireSchema);
