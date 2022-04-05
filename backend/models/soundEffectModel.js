const { default: mongoose } = require("mongoose");

const soundEffectSchema = new mongoose.Schema({
    entity: {
        type: String,
        required: true
    },
    context: {
        type: String,
    },
    sfx: {
        data: Buffer,
        contentType:String,
        path: String
    },
    url: String,
})

module.exports = mongoose.model("SoundEffect", soundEffectSchema);
