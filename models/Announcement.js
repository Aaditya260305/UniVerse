const mongoose = require("mongoose");

const AnnounSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now
        },
    }
);

const Announ = mongoose.model("Announ", AnnounSchema);
module.exports = Announ;