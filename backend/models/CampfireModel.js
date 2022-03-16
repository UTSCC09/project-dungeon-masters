const { default: mongoose } = require("mongoose");

const campfireSchema = new mongoose.Schema({
    ownerId: {
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
    soundtrack: [ { type: String } ],
    scenes: [ { type: String } ],
    followers: [ { type: String } ]
});

module.exports = mongoose.model("campfire", campfireSchema);
