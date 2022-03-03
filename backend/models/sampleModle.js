const { default: mongoose } = require("mongoose");

const sampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    info: {
        type: String,
    },
});

module.exports = mongoose.model("sample", sampleSchema);
