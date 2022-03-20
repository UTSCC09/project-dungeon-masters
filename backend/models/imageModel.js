const { default: mongoose } = require("mongoose");

const imageSchema = new mongoose.Schema({
    ownerUsername: {
        type: String,
        required: true,
    },
    img: {
        data: Buffer,
        contentType:String
    },
    url: String,
});

module.exports = mongoose.model("Image", imageSchema);
