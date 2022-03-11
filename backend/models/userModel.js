const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: String,
    socialMedia: {
        type: Map,
        of: String
    }
});

module.exports = mongoose.model("User", userSchema);
