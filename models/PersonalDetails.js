const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
}
);

const personal_user = mongoose.model("user", userSchema);
module.exports = personal_user;

