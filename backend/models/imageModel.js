const { default: mongoose } = require("mongoose");

const imageSchema = new mongoose.Schema({
    img: {
        data: Buffer,
        contentType:String,
        path: String
    },
    url: String,
});

module.exports = mongoose.model("Image", imageSchema);
