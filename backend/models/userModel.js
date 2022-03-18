const { default: mongoose } = require("mongoose");

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
});

module.exports = mongoose.model("user", userSchema);
