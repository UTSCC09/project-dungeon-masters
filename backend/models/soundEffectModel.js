const { default: mongoose } = require("mongoose");

const soundEffectSchema = new mongoose.Schema({
    entity: {
        type: String,
        required: true
    },
    context: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("soundEffect", soundEffectSchema);
